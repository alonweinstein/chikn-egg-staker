const TritokenProject = require('../../TritokenProject');
const TritokenAutomator = require('../../TritokenAutomator');

const BUSINESSES = require('./contracts/BusinessesContract');
const DOLLA = require('./contracts/DollaContract');
const TYCOON = require('./contracts/TycoonContract');

const project = new TritokenProject("VMTycoon", TYCOON, BUSINESSES, DOLLA, "Businesses", "Dolla");

module.exports = class VMTycoonAutomator extends TritokenAutomator {
    constructor(address, wallet, name) {
        super(address, wallet, name, project);
    }
}