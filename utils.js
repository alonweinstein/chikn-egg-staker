const ethers = require ('ethers');

const NETWORKS = {
    'avalanche' : { 
        name: 'Avalanche Network', 
        chainId: 43114,
        gasSymbol : 'AVAX',
        endpoints: [
            'https://api.avax.network/ext/bc/C/rpc',
        ]
    },
    'bsc' : {
        name: 'bsc-mainnet', 
        chainId: 0x38,
        endpoints: [
            'https://bsc-dataseed.binance.org/',
            'https://bsc-dataseed1.defibit.io/',
            'https://bsc-dataseed1.ninicoin.io/',
            'https://bsc-dataseed2.defibit.io/',
            'https://bsc-dataseed3.defibit.io/',
            'https://bsc-dataseed4.defibit.io/',
            'https://bsc-dataseed2.ninicoin.io/',
            'https://bsc-dataseed3.ninicoin.io/',
            'https://bsc-dataseed4.ninicoin.io/',
            'https://bsc-dataseed1.binance.org/',
            'https://bsc-dataseed2.binance.org/',
            'https://bsc-dataseed3.binance.org/',
            'https://bsc-dataseed4.binance.org/',
        ]
    
    }
};

function getProvider(network) {
    if (!network) return false;

    for (let i=0;i<network.endpoints.length;i++) {
        try {
            const provider = new ethers.providers.StaticJsonRpcProvider(network.endpoints[i], ({name, chainId} = network));
            // console.log(`${i} Connected to ${network.name} ${network.endpoints[i]}`);
            return provider;
        } catch (e) {
            console.log(`${i} Failed connecting to ${network.name}, trying next endpoint option`);
            // nothing to do here -- just catch so we can move on to the next URL
        }
    }   

    throw new Error(`${network.name} not available`);
}

module.exports = {NETWORKS, getProvider}