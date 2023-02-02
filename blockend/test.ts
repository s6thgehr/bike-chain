import { Metaplex, keypairIdentity, sol } from "@metaplex-foundation/js";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { initializeKeypair } from "./utils/initializeKeypair";
import auctionHouseCache from "./auctionHouse/cache.json";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const buyer = await initializeKeypair(connection);

  const metaplex = Metaplex.make(connection).use(keypairIdentity(buyer));

  const auctionHouse = await metaplex.auctionHouse().findByAddress({
    address: new PublicKey(auctionHouseCache.address),
  });

  // Find all bids in an Auction House.
  const listings = await metaplex.auctionHouse().findListings({ auctionHouse });
  const tradeStateAddress = listings[1].tradeStateAddress;

  console.log("# of listings: ", listings.length);

  const listing = await metaplex
    .auctionHouse()
    .findListingByTradeState({ tradeStateAddress, auctionHouse });
  console.log("Listing: ", listing);

  // const cancelListingResponse = await metaplex.auctionHouse().cancelListing({
  //   auctionHouse, // The Auction House in which to cancel listing
  //   listing: listing, // The listing to cancel
  // });
  //
  // console.log("Cancellation: ", cancelListingResponse);
  // const listings2 = await metaplex
  //   .auctionHouse()
  //   .findListings({ auctionHouse });

  // console.log("# of listings: ", listings2.length);

  // const bidResponse = await metaplex.auctionHouse().bid(auctionHouse, buyer)

  // await metaplex.auctionHouse().buy({
  //   auctionHouse,
  //   // buyer,
  //   listing,
  //   // price: sol(0.02),
  // });

  const sales = await metaplex.auctionHouse().findPurchases({ auctionHouse });
  console.log("Sales: ", sales);
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
