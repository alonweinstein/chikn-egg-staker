const TritokenProject = require('../../TritokenProject');
const TritokenAutomator = require('../../TritokenAutomator');

const CHIKN = require('./contracts/ChiknContract');
const EGG = require('./contracts/EggContract');
const FEED = require('./contracts/FeedContract');

const project = new TritokenProject("Chikn", CHIKN, EGG, FEED, "Eggs", "Feed");

module.exports = class ChiknAutomator extends TritokenAutomator {
    constructor(address, wallet, name) {
        super(address, wallet, name, project);
    }
}