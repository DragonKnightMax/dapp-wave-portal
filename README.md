# Wave Portal Contract

A smart contract for wave portal to be deployed on Ethereum Testnet (Rinkeby).

## Tools & Technology

- Hardhat
- Ethereum (Rinkeby Testnet)
- Solidity
- Alchemy
- Metamask
- Rinkeby Etherscan

## Notes

- Make sure you have `Node` or `npm` installed on your PC.
- If you don't have Ethreum wallet, you can create one on [Metamask](https://metamask.io/).
- Switch your Metamask account to Rinkeby Testnet as we will not use real money $$.
- Before deploying the contract, you need some ethereum in your wallet. Claim it on Rinkeby [faucet](https://faucets.chain.link/rinkeby).
- You also need to create an account on [Alchemy](https://www.alchemy.com/).
- Rename `.env-example` to `.env`. Change the following lines:
  
  ```.env
  ALCHEMY_API_KEY=<YOUR_ALCHEMY_API_KEY>
  PRIVATE_KEY=<YOUR_WALLET_PRIVATE_KEY>
  ```
  
   **Important!! Do not share your wallet private key with anyone! You can get hacked!**

## Deploy

- Local

  ```shell
  npx hardhat run scripts/run.js
  ```

- Rinkeby Testnet

  ```shell
  npx hardhat run scripts/deploy.js
  ```

  - Record the contract address deployed on Rinkeby testnet. Your web app need it to talk with the contract on the blockchain.
  - Verify the contract deployment using [Rinkeby Etherscan](https://rinkeby.etherscan.io/).

---

A special thanks to [Buildspace](https://github.com/buildspace) for providing such an amazing course. :)  
[Build a Web3 App with Solidity + Ethereum Smart Contracts](https://app.buildspace.so/projects/CO02cf0f1c-f996-4f50-9669-cf945ca3fb0b)
