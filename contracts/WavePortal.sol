// SPDX-License-Identifier: UNLICENSED

// version of solidity compiler our contract will use
pragma solidity ^0.8.0;

// hardhat console.log()
import "hardhat/console.sol";

contract WavePortal {
    // state variable, stored permanently in contract storage
    uint256 totalWaves;

    // help generate random number
    uint256 private seed;

    // TODO Google
    event NewWave(address indexed from, uint256 timestamp, string message);

    // A struct is basically a custom datatype where we can customize what we want to hold inside it.
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    // store an array of structs, hold all the waves anyone sends!
    Wave[] waves;

    // associate an address with a number (uint256)
    // storing the address with the last time the user waved at us.
    mapping(address => uint256) public lastWavedAt;  // for cooldown

    constructor() payable {  // alow contract to pay people
        console.log("Yo yo, I am a contract and I am smart");
        
        // initial seed
        seed = (block.timestamp + block.difficulty) % 100;
    }

    // msg.sender: wallet address of the person who called the function. 
    // built-in authentication, Know exactly who called the function 
    // to call a smart contract function need to be connected with a valid wallet!
    function wave(string memory _message) public {

        // make sure the current timestamp is at least 15-minutes bigger than the last timestamp stored
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15 minutes"
        );

        // Update the current timestamp for the user
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);

        // store the wave data in array
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // Generate a new seed for the next user that sends a wave
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        // 50% chance to win a prize
        if (seed <= 25) {
            console.log("%s won!", msg.sender);

            // send prize to winner
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        // TODO google
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    // return the struct array, waves, to us.
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}