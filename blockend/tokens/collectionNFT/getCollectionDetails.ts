import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { initializeKeypair } from "../../utils/initializeKeypair";
import * as fs from "fs";
import collectionCache from "./cache.json";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const keypair = await initializeKeypair(connection);

  const metaplex = Metaplex.make(connection).use(keypairIdentity(keypair));

  const mintAddress = new PublicKey(collectionCache.mintAddress);
  const nft = await metaplex.nfts().findByMint({ mintAddress });

  fs.writeFileSync(
    "blockend/tokens/collectionNFT/cache.json",
    JSON.stringify({
      mintAddress: nft.address.toBase58(),
      nft: nft,
    })
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
