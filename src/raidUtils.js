const _ = require('lodash')

function removeFromRaid(raid, message, identifier){
    if(identifier === 'me') return raid.removeMember(message.author)

    const id = identifier.slice(2, -1)
    const user = bot.users.get(id)
    return raid.removeMember(user)
}
function assignRole(raid, client, applicant, role){
    if(role !== 'tank') return 'INVALID ROLE'
    
    const id = applicant.slice(2, -1)
    const user = client.users.get(id)

    if(!_.has(user, 'id')) return INVALID_USER
    return raid.setTank(user)
}
function getMembers(raid, message){
    const members = raid.getMembers()
    if(typeof members === "string") return members
    const array = members.map(member => message.channel.guild.members.get(member.id).nickname || member.username)
    return array.reduce((sum, name, index) => sum += `#${index + 1} - ${name}, `, '')
}
function clearRaid(raid, data){
    if(_.isEmpty(raid)) return EMPTY_RAID

    raid.clear()
    return RAID_CLEARED
}
function listCommands(){
    return `\`\`\`Commands are:
    \n!ping - pings user.
    \n!newraid <name> - Creates a new raid with a name.
    \n!setraid <name> - Sets the named raid as the current raid instance.
    \n!apply - Links you to the raid instance.
    \n!remove me - Removes you from the raid instance.
    \n!members - Gets all current raid instance members
    \n!remove @player - Removes that player from the raid instance.
    \n!clearraid - Clears current raid instance.
    \n!tank <name> - returns tank with no name argument, sets tank with name argument.
    \n!slaveintraining - return best slave. \`\`\``
}

module.exports = {
    listCommands,
    clearRaid,
    getMembers,
    assignRole,
    removeFromRaid
}