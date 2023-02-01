import { Metaplex, keypairIdentity, sol } from "@metaplex-foundation/js";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { initializeKeypair } from "./utils/initializeKeypair";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const buyer = await initializeKeypair(connection);

  const metaplex = Metaplex.make(connection).use(keypairIdentity(buyer));

  const auctionHouse = await metaplex.auctionHouse().findByAddress({
    address: new PublicKey("DkvoYxVv5h5u6mPhDoHCZ27SNhqWV7spxUgMrGgzsAh2"),
  });

  // Find all bids in an Auction House.
  const listings = await metaplex.auctionHouse().findListings({ auctionHouse });
  const receiptAddress = listings[0].receiptAddress;

  const listing = await metaplex
    .auctionHouse()
    .findListingByReceipt({ receiptAddress, auctionHouse });
  console.log(listing);

  // const bidResponse = await metaplex.auctionHouse().bid(auctionHouse, buyer)

  await metaplex.auctionHouse().buy({
    auctionHouse,
    // buyer,
    listing,
    // price: sol(0.02),
  });

  const sales = await metaplex.auctionHouse().findPurchases({ auctionHouse });
  console.log(sales);
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
