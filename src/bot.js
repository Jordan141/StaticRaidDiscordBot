const Discord = require('discord.js')
const token = process.env.TOKEN || require('../auth.json').token
const logger = require('winston')
const _ = require('lodash')
let staticRaid = []


//Commands
const REMOVE_MEMBER = 'remove'
const GET_MEMBERS = 'getmembers'
const HELP = 'help'
const APPLY = 'apply'
const PING = 'ping'

//Responses
const RAID_FULL = 'Current raid is full'
const EMPTY_RAID = 'No members in current raid.'
const ADDED_MEMBER = 'Added to static raid list.'
const INVALID_USER = 'User is not part of raid.'
const USER_ALREADY_EXISTS = 'You are already part of a raid!'
const INVALID_PERMISSIONS = 'You do not have permission to do that.'
const RAID_CLEARED = 'Current raid has been cleared.'

//Variables
const ADMIN_ROLE = 'amazing_role'
const NAME = 'name'

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, { colorize: true })
logger.level = 'debug'
logger.info(`Token: ${token}`)


const userHasPermission = msg => msg.member.roles.find(NAME, ADMIN_ROLE)

function addToRaid(message){
    if(staticRaid.includes(message.author)) return USER_ALREADY_EXISTS
    if(staticRaid.length >= 11) return RAID_FULL
    
    logger.info('addToRaid: ' + staticRaid.join(' ') + ' ' + message.author)
    staticRaid.push(message.author)
    return ADDED_MEMBER
}

function removeFromRaid(message, identifier){
    if(identifier === 'me'){
        return spliceArray(message.author) || 'Removed:' + message.author
    }

    if(userHasPermission(message)){
        const id = identifier.slice(2, -1)
        console.log('ID:', id)
        const user = bot.users.get(id)
        console.log('UserID:', user.id)
        const userExists = _.find(staticRaid, raider => raider.id === user.id)

        if(userExists){
            console.log(staticRaid[0].id === user.id)
            _.remove(staticRaid, raider => raider.id === user.id)
            return 'Removed: ' + user
        }
        return INVALID_USER
    }

    return INVALID_PERMISSIONS
}

function spliceArray(identifier){
    const index = staticRaid.indexOf(identifier)
    //console.log('Identifier:', index, staticRaid)
    if(index === -1) return INVALID_USER
    staticRaid.splice(index, 1)
}
function raidToString(myRaidArray = []){
    if(myRaidArray.length === 0) return EMPTY_RAID
    return myRaidArray.reduce((sum, name, index) => sum += `#${index + 1} - ${name}`, '')
}

function clearRaid(data){
    if(!userHasPermission(data)) return INVALID_PERMISSIONS
    if(_.isEmpty(staticRaid)) return EMPTY_RAID
    staticRaid = []
    return RAID_CLEARED
}
function listCommands(){
    return `Commands are:
    \nPing - pings user.
    \n!apply - Links you to the raid instance.
    \n!remove me - Removes you from the raid instance.
    \n!getmembers - Gets all current raid instance members
    \n!remove @player - Removes that player from the raid instance.`
}

const bot = new Discord.Client({
    token: "",
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
        message.reply(addToRaid(message))
    }
    if(command === REMOVE_MEMBER){
        message.reply(removeFromRaid(message, args[1]))
    }
    if(command === GET_MEMBERS){
        message.reply(raidToString(staticRaid))
    }
    if(command === HELP){
        message.reply(listCommands())
    }
    if(command === CLEAR_CURRENT_RAID){
        message.reply(clearRaid(data))
    }
})

bot.login(token)