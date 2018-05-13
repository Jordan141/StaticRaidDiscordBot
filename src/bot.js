const Discord = require('discord.js')
const Enmap = require('enmap')
const EnmapLevel = require('enmap-level')
const logger = require('winston')
const _ = require('lodash')

const Raid = require('./raid')
const utils = require('./raidUtils')
const {Commands, Responses} = require('./static-content')

const DISCORD_TOKEN = process.env.DISCORD_TOKEN

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
    INVALID_RAID,
    NO_CURRENT_RAID,
    RAID_CLEARED,
    NO_RAIDS_EXIST,
    TANK_SET,
    NO_TANK
} = Responses

//Variables
const ADMIN_ROLE = 'amazing_role'
const NAME = 'name'
const settings = new Enmap({provider: new EnmapLevel({name: "settings"})})

const defaultSettings = {
    prefix: "!",
    currentRaid: null,
    raids: [],
    adminRole: ADMIN_ROLE,
    welcomeChannel: "welcome",
    welcomeMessage: "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D"
}


logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, { colorize: true })
logger.level = 'debug'
logger.info(`Token: ${DISCORD_TOKEN}`)

const bot = new Discord.Client({
    token: DISCORD_TOKEN,
    autorun: true
})

bot.on('ready', () => {
    logger.info('Connected')
    logger.info('Logged in as: ')
    logger.info(`${bot.user.username} - #${bot.user.id}`)
    const guildArray = bot.guilds.array()
    guildArray.forEach(e => logger.info(e.name))
    guildArray.forEach(guild => {
        logger.info('Adding: ' + guild.name + ' to EnMap.')
        settings.set(guild.id, defaultSettings)
    })
})

bot.on('guildCreate', guild => {
    //Adding a new row to the collection
    logger.info('guildCreate Called: ' + guild.name)
    settings.set(guild.id, defaultSettings)
})

bot.on('guildDelete', guild => {
    //Removing an element
    logger.info('guildDelete Called: ' + guild.name)
    settings.delete(guild.id)
})

bot.on('guildMemberAdd', member => {
    const guildConf = settings.get(member.guild.id)
    logger.info('guildMemberAdd Called')
    const welcomeMessage = guildConf.welcomeMessage.replace('{{user}}', member.user.tag)
    member.guild.channels.find('name', guildConf.welcomeChannel).send(welcomeMessage).catch(console.error)
})
 
bot.on('message', async message => {
    //Ignore direct messages and bot messages
   if(!message.guild || message.author.bot) return
    //Load server config
   const guildConf = settings.get(message.guild.id)
    //Stop if message doesn't start with the prefix
   if(message.content.indexOf(guildConf.prefix) !== 0) return

   const args = message.content.split(/\s+/g)
   const command = args.shift().slice(guildConf.prefix.length).toLowerCase()

   if(command === 'setconf'){
       const adminRole = message.guild.roles.find(NAME, guildConf.adminRole)
       
       if(!adminRole || !message.member.hasPermission(adminRole.id)) return message.reply(INVALID_PERMISSIONS)

       const key = args[0]
       const value = args[1]
       if(!guildConf.hasOwnProperty(key)) return message.reply('This key is not in the configuration')

       guildConf[key] = value
       settings.set(message.guild.id, guildConf)
       return message.channel.send(`Guild configuration item ${key} has been changed to:\n\`${value}\``)
   }
   if(command === 'showconf'){
       let configKeys = ''
       Object.keys(guildConf).forEach(key => { configKeys += `${key}    :   ${guildConf[key]}\n` })
       return message.channel.send(`The following are the server's current configuration: \`\`\`${configKeys}\`\`\``)
   }
   if(command === 'newraid'){
       //Check permissions
       const adminRole = message.guild.roles.find(NAME, guildConf.adminRole)
       if(!adminRole || !message.member.hasPermission(adminRole.id)) return message.reply(INVALID_PERMISSIONS)

       //Check that the raidname is valid
       const raidName = args[0]
       if(_.isEmpty(raidName) || guildConf.raids.some(raid => raid.name === raidName)) return message.reply(INVALID_RAID)

       //Create a new raid
       const newRaid = new Raid(raidName)
       logger.info(newRaid)
       //Add it to the raids array
       guildConf.raids = guildConf.raids.concat(newRaid)
       //Notify the user
       return message.channel.send(`Raid ${raidName} has been created.`)
   }
   if(command === 'setraid'){
       //Check permissions
       const adminRole = message.guild.roles.find(NAME, guildConf.adminRole)
       if(!adminRole || !message.member.hasPermission(adminRole.id)) return message.reply(INVALID_PERMISSIONS)
       //Make sure it's not empty
       if(_.isEmpty(guildConf)) return NO_RAIDS_EXIST

       const raidName = args[0]
       //Check if the raid exists
       if(!guildConf.raids.some(raid => raid.name === raidName)) return message.reply(INVALID_RAID)
       //Assign the raid to be current
       guildConf.currentRaid = guildConf.raids.find(raid => raid.name === raidName)
       //Save to config
       settings.set(message.guild.id, guildConf)
       //Notify the user
       return message.reply(`${raidName} has been set as the current active raid.`)
    }
    if(command === 'jail'){
        const links = ['http://i0.kym-cdn.com/photos/images/original/001/222/622/aaf.jpg', 'http://i0.kym-cdn.com/photos/images/original/001/246/253/bdc.png']
        const num = Math.floor(Math.random() * links.length)
        return message.channel.send("Time for jail onii-chan", {files: [links[num]]})
    }
    if(command === APPLY){
        if(_.isEmpty(guildConf.currentRaid)) return message.channel.send(NO_CURRENT_RAID)
        const raid = guildConf.currentRaid
        return message.channel.send(raid.addMember(message.author))
    }
    if(command === REMOVE_MEMBER){
        if(_.isEmpty(guildConf.currentRaid)) return message.channel.send(NO_CURRENT_RAID)
        const raid = guildConf.currentRaid
        return message.channel.send(utils.removeFromRaid(raid, message, args[0]))
    }
    if(command === GET_MEMBERS){
        if(_.isEmpty(guildConf.currentRaid)) return message.channel.send(NO_CURRENT_RAID)
        const raid = guildConf.currentRaid
        return message.channel.send(utils.getMembers(raid, message))
    }
    if(command === HELP){
        return message.channel.send(utils.listCommands())
    }
    if(command === CLEAR_CURRENT_RAID){
        if(_.isEmpty(guildConf.currentRaid)) return message.channel.send(NO_CURRENT_RAID)
        const raid = guildConf.currentRaid
        return message.channel.send(utils.clearRaid(raid, message))
    }
    if(command === TANK_COMMAND){
        if(_.isEmpty(guildConf.currentRaid)) return message.channel.send(NO_CURRENT_RAID)
        const raid = guildConf.currentRaid

        if(_.isEmpty(args[1])) return message.channel.send(`Tank: ${raid.getTank()}`)
        return message.channel.send(utils.assignRole(raid, message, args[0], 'tank'))
    }
    if(command === 'slaveintraining'){
        return message.channel.send('https://bnstree.com/character/eu/Miadonis')
    }
})

bot.login(DISCORD_TOKEN)