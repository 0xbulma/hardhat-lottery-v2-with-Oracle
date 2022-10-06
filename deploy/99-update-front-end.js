const { ethers } = require('hardhat');
const fs = require('fs');

const FRONT_END_ADDRESSES_FILE = '/Users/bulma/Documents/personal-web/personal/constants/lottery/contractAddresses.json';
const FRONT_END_ABI_FILE = '/Users/bulma/Documents/personal-web/personal/constants/lottery/abi.json';

module.exports = async function (){
  if(process.env.UPDATE_FRONT_END){
    console.log('Updating front end...');
    await updateContractAddresses()
    await updateAbi();
  }
}

async function updateAbi(){
  const raffle = await ethers.getContract('Raffle');
  fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses(){
  const raffle = await ethers.getContract('Raffle');
  const chainId = network.config.chainId.toString();
  const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, 'utf-8'));
  if(chainId in currentAddresses) {
    if(!currentAddresses[chainId].includes(raffle.address)){
      currentAddresses[chainId].push(raffle.address)
    }
  } else {
    currentAddresses[chainId] = [raffle.address]

  }
  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

module.exports.tags = ['all', 'front-end']