const Discord = require('discord.js')
const _ = require('lodash')
const {Responses} = require('./static-content')

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


class Raid {
    constructor(name, members, tank){
        this.name = name || '' 
        this.members = members || []
        this.tank = tank || ''

        if(this.name === '') throw new Error('Name must be set when creating a raid.')
    }
    setTank(member){
        if(!member instanceof Discord.User || _.isEmpty(member)) return INVALID_USER
        const userExists = _.find(this.members, raider => raider.id === member.id)
        if(!userExists) return USER_NOT_FOUND

        this.tank = member
        return TANK_SET
    }
    getTank(){
        return this.tank || NO_TANK
    }
    hasTank(){
        return !_.isEmpty(this.tank)
    }
    isFull(){
        return this.members.length >= 11
    }
    isEmpty(){
        return _.isEmpty(this.members)
    }
    addMember(member){
        if(this.isFull()) return RAID_FULL
        if(!(member instanceof Discord.User) || _.isEmpty(member)) return INVALID_USER
        this.members.push(member)
        return ADDED_MEMBER
    }
    getMembers(){
        if(this.members.length === 0) return EMPTY_RAID
        return this.members.reduce((sum, name, index) => sum += `#${index + 1} - ${name}`, '')
    }
    removeMember(member){    
        const userExists = _.find(this.members, raider => raider.id === member.id)
        if(!userExists) return USER_NOT_FOUND

        _.remove(this.members, raider => raider.id === user.id)
        return 'Removed: ' + user
    }
}

module.exports = Raid