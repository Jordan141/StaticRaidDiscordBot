const Discord = require('discord.io')
const token = process.env.TOKEN || require('../auth.json').token
const logger = require('winston')

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, { colorize: true })
logger.level = 'debug'

const bot = new Discord.Client({
    token: "",
    autorun: true
})
 
bot.on('ready', () => {
    logger.info('Connected')
    logger.info('Logged in as: ')
    logger.info(`${bot.username} - # ${bot.id}`)
})
 
bot.on('message', (user, userID, channelID, message, event) => {
   if(message[0] === '!'){
       const args = message.substring(1).split(' ')
       const cmd = args[0]
       
       switch(cmd){
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                })
            break
       }
   }
})