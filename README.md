# NFT Phygital Art Gallery

The NFT Phygital Art Gallery is a sample project showcasing the power of the Verbwire platform as a backend for transforming a physical gallery into a physical-and-digital business. We use the Verbwire platform for creating smart contracts for each physical gallery (also extendable to each individual artist) and minting physical artwork to digital formats on the blockchain instantenously. We leverage the pay-splitter functionality of the Verbwire smart-contracts in defining revenue splits between the platform owner and the galleries. Additionally, we provide functionality allowing the galleries to add artists, edit listed artwork, cash out, check unredeemed balances, set and update royalties, etc.

## Endpoints

The app utilizes the following endpoints for various operations:

1. Deploy contracts: [Deploy Contract Endpoint](https://docs.verbwire.com/reference/post_nft-deploy-deploycontract)  
   This endpoint is used to deploy contracts.

2. Add payee to contract: [Add payee Endpoint](https://docs.verbwire.com/reference/post_nft-update-addpayee)  
   Use this endpoint to add a payee to the contract.

3. Add metadata to IPFS: [Store Metadata on IPFS Endpoint](https://docs.verbwire.com/reference/post_nft-store-metadatafromimage)  
   This endpoint is responsible for adding metadata to the InterPlanetary File System (IPFS).

4. Mint using Metadata URI: [Quickmint Endpoint](https://docs.verbwire.com/reference/post_nft-mint-quickmintfrommetadataurl)  
   Use this endpoint to mint NFTs using a metadata URI.

5. Withdraw Funds: [Withdwar funds to Wallet Endpoint](https://docs.verbwire.com/reference/post_nft-update-withdrawfundstowallet)  
   This endpoint allows the withdrawal of funds to a wallet.

Additionally, the dApp performs direct contract interactions using the function ABI:

```solidity
mint(address recipient, string memory tokenURI, uint256 quantity) payable
```

## Running the App

Before running the app, please make the following changes in the `credentials.js` file:

1. Add Verbwire API Keys: Open the `credentials.js` file and locate the section for adding Verbwire API keys. Replace `YOUR_VERBWIRE_API_KEYS` with your actual API keys provided by Verbwire.

2. Add Platform Owner's Wallet Address: In the same `credentials.js` file, find the section for adding the Platform owner's wallet address. Replace `PLATFORM_OWNER_WALLET_ADDRESS` with the actual wallet address of the Platform owner.

Once you have made these changes, you can proceed to run the app using the following commands:

To run the client:
```
npm run dev
```

To run the Server:
```
npm run dev:server
```

Make sure you have all the necessary dependencies installed and properly configured before running the app.

## Additional Resources

For additional reference, you can also check out this video tutorial: [Verbwire - NFT Art Gallery Demo Video](https://youtu.be/eO1Vhi8GKvI)

That's it! You should now have the project set up and ready to use. If you have any questions or run into any issues, please feel free to reach out. Happy coding!

