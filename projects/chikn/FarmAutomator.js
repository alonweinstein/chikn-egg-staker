const ethers = require('ethers');

const FARMLANDLP = require('./contracts/FarmlandLPContract');
const FARMLAND = require('./contracts/FarmlandContract');


const BASE_FULL_FARM_AMOUNT = 1000;

module.exports = class FarmAutomator {   
    constructor(address, wallet, name) {
        this.address = address;
        this.wallet = wallet;
        this.name = name;
    }

    async checkPending() {
        try {
            const lp = new ethers.Contract(FARMLANDLP.ADDRESS, FARMLANDLP.ABI, this.wallet);
            const farmland = new ethers.Contract(FARMLAND.ADDRESS, FARMLAND.ABI, this.wallet);
    
            const activeFarmId = await lp.checkActiveFarm();
            const activeFarmBigness = await farmland.farmLevelCounter(activeFarmId);
            const mult = await lp.fertilityMultiplier(activeFarmId);
    
            const fullFarmAmount = BASE_FULL_FARM_AMOUNT * (activeFarmBigness.toNumber()+1);
            const pending = await lp.claimableView();
    
            const isFull = (ethers.utils.formatUnits(pending)>=fullFarmAmount);
    
            console.log(`Active Farm ID: ${activeFarmId.toNumber()}: Bignesss: ${activeFarmBigness.toNumber()+1}, Maximum Feed: ${fullFarmAmount}, Multiplier: x    ${mult/10}, pending feed: ${ethers.utils.formatUnits(pending)}`);
    
            if (isFull) {
                const claimTx = await lp.claimReward(this.address);
                const receipt = await claimTx.wait();
                return receipt;    
            } else {
                return false;
            }
        } catch (e) {
            console.log(`Failed while trying to automate farm: ${e}`);
            return false;
        }
    }
}