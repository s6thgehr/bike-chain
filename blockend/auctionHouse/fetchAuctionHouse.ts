import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { initializeKeypair } from "../utils/initializeKeypair";
import * as fs from "fs";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const keyPair = await initializeKeypair(connection);

  const metaplex = Metaplex.make(connection).use(keypairIdentity(keyPair));

  const auctionHouse = await metaplex.auctionHouse().findByAddress({
    address: new PublicKey("DkvoYxVv5h5u6mPhDoHCZ27SNhqWV7spxUgMrGgzsAh2"),
  });

  fs.writeFileSync(
    "blockend/auctionHouse/cache.json",
    JSON.stringify(auctionHouse)
  );
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
