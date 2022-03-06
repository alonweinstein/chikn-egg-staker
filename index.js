const fs = require('fs');
const axios = require('axios');
const ethers = require('ethers');
const { Command, Option } = require('commander');
const { NETWORKS, getProvider } = require ('./utils');

const VMTycoonAutomator = require('./projects/vmtycoon/VMTycoonAutomator');
const MinerJoeAutomator = require('./projects/minerjoe/MinerJoeAutomator');
const ChiknAutomator = require('./projects/chikn/ChiknAutomator');
const FarmAutomator = require('./projects/chikn/FarmAutomator');
const AntAutomator = require('./projects/avalant/AntAutomator.js');


const program = new Command();
program.version('0.0.1');

const projectOption = new Option('-p, --project <project-name>', 'project name').choices(['chikn', 'vmtycoon', 'minerjoe', 'farmland', 'avalant']);
projectOption.makeOptionMandatory(true);

program
    .requiredOption('-c, --configFile <config file>', 'Path to config file with addresses & keys', 'config.json')
    .addOption(projectOption)
    .option('--claim-egg', 'claim "Egg" token', true)
    .option('--claim-feed', 'claim "Feed"" token. If you\'re staking the "Egg" token this happens automatically.', false)
    .option('--stake-egg', 'Stake "Egg" token', false);

program.addHelpText('after', `

    When using the chikn-farmland project, the claim & stake options are ignored. The feed will be claimed only if the farmland is full.`);


function log(config, message, isError) {
    const text = `${isError ? ':bomb:' : ':success:'} ${message}`;
    if (config.webhookUrl) axios.post(config.webhookUrl, {text});

    console.log(message);
}
    
async function go (config, options) {
    const provider = getProvider(NETWORKS['avalanche']);
    const wallet = new ethers.Wallet(config.privateKey, provider);

    if (options.project=='farmland') {
        const farmAuto = new FarmAutomator(config.address, wallet, config.name);
        const pending = await farmAuto.checkPending();
        if (pending) {
            log(config, `:chicken: Claimed feed from farm`)
        }
    } else {
        let auto;

        switch (options.project) {
            case 'chikn':
                auto = new ChiknAutomator(config.address, wallet, config.name);
                break;
            case 'vmtycoon':
                auto = new VMTycoonAutomator(config.address, wallet, config.name);
                break;
            case 'minerjoe':
                auto = new MinerJoeAutomator(config.address, wallet, config.name);
                break;
            case 'avalant':
                auto = new AntAutomator(config.address, wallet, config.name);
                break;
    
            default:
                return;
        }
        
        if (options.claimEgg) {
            const tokenIds = await auto.getTokenIDs();
            await auto.claim(tokenIds);
            log(config, `Claimed ${auto.eggTokenName()}`);
        }

        if (options.stakeEgg) {
            const {stakeEggReceipt : receipt, stakedEggTokens : tokens} = await auto.stake();
            log(config, `Staked ${stakedEggTokens} ${auto.eggTokenName()}`);
        } else if (options.claimFeed) {
            await auto.claimFeed();
            log(config, `Claimed ${auto.feedTokenName()}`);
        }   
    }   
}

async function devGo(config, options) {
}

program.parse(process.argv);

const options = program.opts();
const {configFile} = options;
const config = JSON.parse(fs.readFileSync(configFile));

if (config.dev) {
    devGo(config, options);
} else {
    go(config, options).then(x => console.log(x));
}

