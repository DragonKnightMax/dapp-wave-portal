// create a new local ethereum network and destroy it after the program ends
// npx hardhat run scripts/run.js

const main = async () => {
  
    //const [owner, randomPerson] = await hre.ethers.getSigners();

    // compile our contract
    // generate the necessary files to work with our contract under the artifacts directory
    // HRE = Hardhat Runtime Environment = Hardhat, no need to import
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    
    // Hardhat create a local Ethereum network just for this contract
    // after the script completes it'll destroy that local network
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"), // fund the contract with 0.1 ETH
    });
    
    // wait until contract is officially deployed to local blockchain
    // constructor runs when we actually deploy
    await waveContract.deployed();

    // give us the address of the deployed contract to find our contract on the blockchain.
    console.log("Contract deployed to:", waveContract.address);
    //console.log("Contract deployed by:", owner.address);


    // Get Contract balance
    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    // Send wave with message
    const waveTxn = await waveContract.wave("This is wave #1");
    await waveTxn.wait(); // Wait for the transaction to be mined

    const waveTxn2 = await waveContract.wave("This is wave #2");
    await waveTxn2.wait();

    // get new contract balance after sending ethers to waver
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    // get all waves
    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
};
  
const runMain = async () => {
    try {
        await main();
        process.exit(0); // exit Node process without error
    } catch (error) {
        console.log(error);
        process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
    // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};
  
runMain();