const Discord = require('discord.js')
const token = process.env.TOKEN || require('../auth.json').token
const logger = require('winston')
let staticRaid = []


//Commands
const REMOVE_MEMBER = '!removeme'
const GET_MEMBERS = '!getmembers'

//Responses
const RAID_FULL = 'Current raid is full'
const EMPTY_RAID = 'No members in current raid.'
const ADDED_MEMBER = 'Added to static raid list.'
const INVALID_USER = 'User is not part of raid.'
const USER_ALREADY_EXISTS = 'You are already part of a raid!'

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, { colorize: true })
logger.level = 'debug'
logger.info(`Token: ${token}`)

function addToRaid(message){
    if(staticRaid.includes(message.author)) return USER_ALREADY_EXISTS
    if(staticRaid.length >= 11) return RAID_FULL
    
    logger.info('addToRaid: ' + staticRaid.join(' ') + ' ' + message.author)
    staticRaid.push(message.author)
    return ADDED_MEMBER
}

function removeFromRaid(message){
    const index = staticRaid.indexOf(message.author)
    if(index === -1) return INVALID_USER
    
    staticRaid.splice(index, 1)
    return 'Removed: ' + message.author
}
function raidToString(myRaidArray = []){
    if(myRaidArray.length === 0) return EMPTY_RAID
    return myRaidArray.reduce((sum, val, index) => sum += `#${index + 1} - ${val}`, '')
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
    const command = message.content.toLowerCase()

    if(command === 'ping'){
        message.reply('pong')
    }
    if(command === '+'){
        message.reply(addToRaid(message))
    }
    if(command === REMOVE_MEMBER){
        message.reply(removeFromRaid(message))
    }
    if(command === GET_MEMBERS){
        message.reply(raidToString(staticRaid))
    }
})

bot.login(token)