0. Delete private key from .env

1. Create new NFT Collection

- yarn ts-node blockend/tokens/collectionNFT/createOrUpdateCollection.ts
- ensure that createNFT is called instead of updateNFT
- save generated private key in .env.local as NEXT_PUBLIC_PRIVATE_KEY

2. Create AuctionHouse

- yarn ts-node blockend/auctionHouse/createOrUpdateAuctionHouse.ts
- update auctionHouse address in fetAuctionHouse.ts and run yarn ts-node blockend/auctionHouse/fetchAuctionHouse.ts (should be improved in the future and done in one step with creating auctionhouse)
- fund auctionhouse fee account with CLI
