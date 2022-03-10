const ethers = require('ethers');

module.exports = class TritokenAutomator {   
    constructor(address, wallet, name, project) {
        this.address = address;
        this.wallet = wallet;
        this.name = name;
        this.project = project;
    }

    minEggStake = 0
    minFeedStake = 0
    stakeEggMethodName = "staking"

    eggTokenName() {
        return this.project.claimEggMethodSuffix;
    }

    feedTokenName() {
        return this.project.claimFeedMethodSuffix;
    }

    async getTokenIDs() {
        const ids = [];

        try {
            const contract = new ethers.Contract(this.project.chikn.ADDRESS, this.project.chikn.ABI, this.wallet);
            const tokensCount = await contract.balanceOf(this.address);

            for (let i=0; i<tokensCount.toNumber(); i++) {
                const token = await contract.tokenOfOwnerByIndex(this.address, i);
                ids.push(token.toNumber());
            }
        } catch (e) {
            console.log(e);
        }
        return ids;

    }

    async claim(tokenIds) {
        if (!tokenIds || tokenIds.length==0) return;
        try {
            const contract = new ethers.Contract(this.project.egg.ADDRESS, this.project.egg.ABI, this.wallet);

            const methodName = 'claim' + this.project.claimEggMethodSuffix;

            const claimTx = await contract[methodName](tokenIds);
    
            const receipt = await claimTx.wait();
            return receipt;
        } catch (e) {
            console.log(`Failed claiming ${this.project.claimEggMethodSuffix} ${this.name} ${tokenIds.join(",")} ${e}`);
            return false;
        }
    }

    async claimFeed() {
        try {
            const contract = new ethers.Contract(this.project.feed.ADDRESS, this.project.feed.ABI, this.wallet);

            const feedBalance = await contract.balanceOf(this.address);

            const methodName = 'claim' + this.project.claimFeedMethodSuffix;

            const claimTx = await contract[methodName]();
    
            const receipt = await claimTx.wait();
            return receipt;
        } catch (e) {
            console.log(`Failed claiming ${this.project.claimFeedMethodSuffix} ${this.name} ${tokenIds.join(",")} ${e}`);
            return false;
        }
    }

    async stake() {
        try {
            const eggContract = new ethers.Contract(this.project.egg.ADDRESS, this.project.egg.ABI, this.wallet);
            const feedContract = new ethers.Contract(this.project.feed.ADDRESS, this.project.feed.ABI, this.wallet);
    
            const eggBalance = await eggContract.balanceOf(this.address);

            if (eggBalance>this.minEggStake) {
                console.log(`Staking ${ethers.utils.formatUnits(eggBalance)} tokens`);

                const stakeTx = await feedContract[this.stakeEggMethodName](eggBalance);
                const receipt = await stakeTx.wait();
                return {receipt};
            } else {
                console.log(`No tokens available for ${this.name}`);
                return false;
            }
        } catch (e) {
            console.log(`Failed staking tokens ${this.name} ${e}`);
            return false;
        }
    }
}