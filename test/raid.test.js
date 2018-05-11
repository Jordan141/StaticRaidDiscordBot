const Discord = require('discord.js')
const {Responses} = require('../src/static-content')
const Raid = require('../src/raid')
const assert = require('assert')
const _ = require('lodash')

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

const BAD_USER = require('./dummyUser.json')
const STATIC_RAID = 'Static Raid'
const DYNAMIC_RAID = 'Dynamic Raid'
const TRUE = true
const FALSE = false

let raid;

describe('Raid Class', () => {
    beforeEach(() => {
        raid = new Raid(STATIC_RAID)
    })

    afterEach(() => {
        raid = null
    })
    it('Should return the name of the instantiated class', () => {
        assert.deepStrictEqual(raid.name, STATIC_RAID)
    })
    it('Should have a name, but no members or tank on init', () => {
        assert.deepStrictEqual(raid.name, STATIC_RAID)
        assert.deepStrictEqual(raid.members, [])
        assert.deepStrictEqual(raid.tank, '')
    })
    it('Should return false if the name is different', () => {
        assert.notDeepEqual(raid.name, DYNAMIC_RAID)
    })
    it('Should be empty on init', () => {
        assert.deepStrictEqual(raid.isEmpty(), TRUE)
    })
    it('Should not be full on init', () => {
        assert.deepStrictEqual(raid.isFull(), FALSE)
    })
    it('Should return EMPTY_RAID on init', () => {
        assert.deepStrictEqual(raid.getMembers(), EMPTY_RAID)
    })
    it('Should return NO_TANK on startup', () => {
        assert.deepStrictEqual(raid.getTank(), NO_TANK)
    })
    it('Should return FALSE with no tank on startup', () => {
        assert.deepStrictEqual(raid.hasTank(), FALSE)
    })
    it('Should return USER_NOT_FOUND', () => {
        assert.deepStrictEqual(raid.removeMember(BAD_USER), USER_NOT_FOUND)
    })
    it('Should return INVALID_USER', () => {
        assert.deepStrictEqual(raid.addMember(BAD_USER), INVALID_USER)
    })
   it('Should return RAID_FULL if the members array has a length of 12', () => {
       raid.members = _.range(0, 12)
       assert.deepStrictEqual(raid.addMember(BAD_USER), RAID_FULL)
   })
})
