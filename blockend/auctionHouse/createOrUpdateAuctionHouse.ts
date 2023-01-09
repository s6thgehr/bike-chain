import {
  Metaplex,
  keypairIdentity,
  CreateAuctionHouseInput,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { initializeKeypair } from "../utils/initializeKeypair";
import * as fs from "fs";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const keyPair = await initializeKeypair(connection);

  const metaplex = Metaplex.make(connection).use(keypairIdentity(keyPair));

  const auctionHouseSettings: CreateAuctionHouseInput = {
    sellerFeeBasisPoints: 200,
    // authority: keyPair,
    // requiresSignOff: false,
    // canChangeSalePrice: false,
    // treasuryMint: PublicKey,
    // feeWithdrawalDestination: PublicKey,
    // treasuryWithdrawalDestinationOwner: PublicKey,
    // auctioneerAuthority: PublicKey,
    // auctioneerScopes: AuthorityScope[],
  };

  await createAuctionHouse(metaplex, auctionHouseSettings);
}

async function createAuctionHouse(
  metaplex: Metaplex,
  settings: CreateAuctionHouseInput
) {
  const auctionHouse = await metaplex.auctionHouse().create(settings);

  return auctionHouse;
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
