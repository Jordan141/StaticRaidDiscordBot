const Discord = require('discord.js')
const DISCORD_TOKEN = process.env.DISCORD_TOKEN// || require('../config.json').token
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
    TANK_COMMAND,
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
logger.info(`Token: ${DISCORD_TOKEN}`)


const userHasPermission = msg => msg.member.roles.find(NAME, ADMIN_ROLE)


function removeFromRaid(message, identifier){
    if(identifier === 'me') return staticRaid.removeMember(message.author)
    if(!userHasPermission(message)) return INVALID_PERMISSIONS

    const id = identifier.slice(2, -1)
    const user = bot.users.get(id)
    return staticRaid.removeMember(user)
}
function assignRole(message, applicant, role){
    if(!userHasPermission(message)) return INVALID_PERMISSIONS
    if(role !== 'tank') return 'INVALID ROLE'
    
    const id = applicant.slice(2, -1)
    const user = bot.users.get(id)

    if(!_.has(user, 'id')) return INVALID_USER
    return staticRaid.setTank(user)
}
function clearRaid(data){
    if(!userHasPermission(data)) return INVALID_PERMISSIONS
    if(_.isEmpty(staticRaid)) return EMPTY_RAID

    staticRaid.clear()
    return RAID_CLEARED
}
function listCommands(){
    return `\`\`\`Commands are:
    \n!ping - pings user.
    \n!apply - Links you to the raid instance.
    \n!remove me - Removes you from the raid instance.
    \n!members - Gets all current raid instance members
    \n!remove @player - Removes that player from the raid instance.
    \n!clearraid - Clears current raid instance.
    \n!tank <name> - returns tank with no name argument, sets tank with name argument. \`\`\``
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
    if(command == 'nut'){
        message.reply('Animus, Ferocity, or Energy?')
    }
    if(command === 'jail'){
        const links = ['http://i0.kym-cdn.com/photos/images/original/001/222/622/aaf.jpg', 'http://i0.kym-cdn.com/photos/images/original/001/246/253/bdc.png']
        const num = Math.floor(Math.random() * links.length)
        message.channel.send("Time for jail onii-chan", {files: [links[num]]})
    }
    if(command === APPLY){
        message.channel.send(staticRaid.addMember(message.author))
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
        message.channel.send(clearRaid(message))
    }
    if(command === TANK_COMMAND){
        if(_.isEmpty(args[1])) return message.channel.send(`Tank: ${staticRaid.getTank()}`)
        message.channel.send(assignRole(message, args[1], 'tank'))
    }
    if(command === 'bestalt'){
        message.channel.send('https://bnstree.com/character/eu/Miadonis')
    }
})

bot.login(DISCORD_TOKEN)