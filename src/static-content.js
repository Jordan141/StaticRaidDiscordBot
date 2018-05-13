const Commands = {
    REMOVE_MEMBER : 'remove',
    CLEAR_CURRENT_RAID : 'clearraid',
    GET_MEMBERS : 'members',
    TANK_COMMAND: 'tank',
    HELP : 'help',
    APPLY : 'apply',
    PING : 'ping',
}

const Responses = {
    RAID_FULL : 'Current raid is full',
    EMPTY_RAID : 'No members in current raid.',
    ADDED_MEMBER : 'Added to static raid list.',
    USER_NOT_FOUND : 'User is not part of raid.',
    INVALID_USER : 'Format is incorrect.',
    USER_ALREADY_EXISTS : 'You are already part of a raid!',
    INVALID_PERMISSIONS : 'You do not have permission to do that.',
    RAID_CLEARED : 'Current raid has been cleared.',
    NO_RAIDS_EXIST: 'There have been no raids created.',
    NO_CURRENT_RAID: 'There is currently no active raid',
    INVALID_RAID: 'No raid under that name',
    TANK_SET : 'Tank has been set.',
    NO_TANK : 'No tank has been set.'
}


module.exports = {Commands, Responses}

