import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { initializeKeypair } from "../utils/initializeKeypair";
import * as fs from "fs";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const keyPair = await initializeKeypair(connection);

  const metaplex = Metaplex.make(connection).use(keypairIdentity(keyPair));

  const auctionHouse = await metaplex.auctionHouse().findByAddress({
    address: new PublicKey("A64ssYbqry4D99a85oRsGC2FHAmY7tfcEf3D94zcHh9a"),
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
