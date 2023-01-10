import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));

  const metaplex = Metaplex.make(connection);

  const auctionHouse = await metaplex.auctionHouse().findByAddress({
    address: new PublicKey("DkvoYxVv5h5u6mPhDoHCZ27SNhqWV7spxUgMrGgzsAh2"),
  });

  // Find all bids in an Auction House.
  const bids = await metaplex.auctionHouse().findListings({ auctionHouse });

  console.log(bids);
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
