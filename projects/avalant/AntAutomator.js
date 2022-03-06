const TritokenProject = require('../../TritokenProject');
const TritokenAutomator = require('../../TritokenAutomator');

const CHIKN = require('./contracts/AntContract');
const EGG = require('./contracts/AntgoldContract');
const FEED = require('./contracts/SugaContract');

const project = new TritokenProject("Ant", CHIKN, EGG, FEED, "AntGold", "Suga");


module.exports = class AntAutomator extends TritokenAutomator {
    constructor(address, wallet, name) {
        super(address, wallet, name, project);
        this.stakeEggMethodName = "stakeAntg";
    }
}


