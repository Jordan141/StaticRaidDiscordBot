const Discord = require('discord.js')
const token = process.env.DISCORD_TOKEN
const logger = require('winston')
const _ = require('lodash')
const Raid = require('./raid')
const {Commands, Responses} = require('./static-content')

const staticRaid = new Raid('Static Raid')


//Commands
const {
    REMOVE_MEMBER,
    CLEAR_CURRENT_RAID,
    GET_MEMBERS,
    HELP,
    APPLY,
    PING
} = Commands

//Responses
const {
    RAID_FULL,
    EMPTY_RAID,
    ADDED_MEMBER,
    USER_NOT_FOUND,
    INVALID_USER,
    USER_ALREADY_EXISTS,
    INVALID_PERMISSIONS,
    RAID_CLEARED,
    TANK_SET,
    NO_TANK
} = Responses

//Variables
const ADMIN_ROLE = 'amazing_role'
const NAME = 'name'

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, { colorize: true })
logger.level = 'debug'
logger.info(`Token: ${token}`)


const userHasPermission = msg => msg.member.roles.find(NAME, ADMIN_ROLE)


function removeFromRaid(message, identifier){
    if(identifier === 'me') return staticRaid.removeMember(message.author)
    if(!userHasPermission(message)) return INVALID_PERMISSIONS

    const id = identifier.slice(2, -1)
    const user = bot.users.get(id)
    return staticRaid.removeMember(user)
}

function clearRaid(data){
    if(!userHasPermission(data)) return INVALID_PERMISSIONS
    if(_.isEmpty(staticRaid)) return EMPTY_RAID

    staticRaid.clear()
    return RAID_CLEARED
}
function listCommands(){
    return `\`Commands are:
    \nPing - pings user.
    \n!apply - Links you to the raid instance.
    \n!remove me - Removes you from the raid instance.
    \n!getmembers - Gets all current raid instance members
    \n!remove @player - Removes that player from the raid instance.
    \n!clearraid - Clears current raid instance.\``
}

const bot = new Discord.Client({
    token: DISCORD_TOKEN,
    autorun: true
})
 
bot.on('ready', () => {
    logger.info('Connected')
    logger.info('Logged in as: ')
    logger.info(`${bot.username} - # ${bot.id}`)
})
 
bot.on('message', message => {
    if (message.content.substring(0, 1) != '!') return
    
    const args = message.content.substring(1).toLowerCase().split(' ')
    const command = args[0]

    if(command === PING){
        message.reply('pong')
    }
    if(command === APPLY){
        message.channel.send(staticRaid.addMember(message))
    }
    if(command === REMOVE_MEMBER){
        message.channel.send(removeFromRaid(message, args[1]))
    }
    if(command === GET_MEMBERS){
        message.channel.send(staticRaid.getMembers())
    }
    if(command === HELP){
        message.channel.send(listCommands())
    }
    if(command === CLEAR_CURRENT_RAID){
        message.channel.send(clearRaid(data))
    }
})

bot.login(token)