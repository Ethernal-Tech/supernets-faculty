# Supernets-faculty


To deploy a contract you will first need to set up your Polygon Edge chain. This can be done locally or by using any cloud service. You can also connect to one of the existing EVM testnets like Goerli, Renkeby etc.
To set up your chain please follow the official [installation guide](https://docs.polygon.technology/docs/edge/get-started/installation) provided by Polygon Technologies.

Contract deployment is done by using [Remix - Ethereum IDE](https://remix.ethereum.org/), environment for writing, testing and deploying solidity contracts.

You will also need MetaMask extension to connect with your wallet.

**Steps to deploying contract:**
- Open Remix IDE and create a new solidity contract file in file explorer and give it a name.
- Copy/paste code from Faculty.sol to file created in step 1.
- Go to the Solidity compiler tab (make sure the right contract is opened), check if the compiler version matches the version in contract and click Compile.
- Go to Deploy & run transaction tab,
(For next step you will need to have your MetaMask wallet connected and to have some tokens in your account. For your chain you can use --premine and for testnets you can use one of dedicated faucets).
- For Environment select Inject Web3 and connect to your MetaMask wallet.
- Make sure the correct account and contract are selected and click Deploy.

*If you don’t have MetaMask or any testnet running you can always select any JavaScript VM and deploy your contract there. Keep in mind that it’s only for testing purposes and the web app won’t be able to connect to it.*

**Running Web app**

After your contract is deployed you will need to get a contract address from your chain. That can be done by using any block explorer and searching contract deployment transaction hash from console logs. For local Polygon chain you can use [Expedition](https://expedition.dev/?rpcUrl=http://localhost:10002) block explorer (Rinkeby, Goerli and other testnets usually have their own block explorers which you can find by using your favorite browser).

In faculty.js file you will need to replace address with your contract address found in block explorer.

`const address = ‘0x5B38Da6a701c568545dCfcB03FcB875f56beddC4’`

To run a web app you will need to have Node.js installed.
From the WebApp folder simply run `npm install` and `npm start`. Login with MetaMask and enjoy the app.
