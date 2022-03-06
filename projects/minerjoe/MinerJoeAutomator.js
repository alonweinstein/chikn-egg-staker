const TritokenProject = require('../../TritokenProject');
const TritokenAutomator = require('../../TritokenAutomator');

const GOLD = require('./contracts/GoldContract');
const CREDITS = require('./contracts/CreditsContract');
const MINER = require('./contracts/MinerContract');

const project = new TritokenProject("MinerJoe", MINER, GOLD, CREDITS, "Gold", "Credits");

module.exports = class MinerJoeAutomator extends TritokenAutomator {
    constructor(address, wallet, name) {
        super(address, wallet, name, project);
    }
}