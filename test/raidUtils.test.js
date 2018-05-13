const Discord = require('discord.js')
const {Responses} = require('../src/static-content')
const utils = require('../src/raidUtils')
const Raid = require('../src/raid')
const assert = require('assert')
const _ = require('lodash')

const STATIC_RAID = 'Static Raid'
const DYNAMIC_RAID = 'Dynamic Raid'

let RAID

describe('Raid Utils Unit Tests', () => {
    beforeEach(() => {
        RAID = new Raid(STATIC_RAID)
    })
    afterEach(() => {
        RAID = null
    })
})