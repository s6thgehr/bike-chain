import { Connection, PublicKey } from "@solana/web3.js";
import {
  Metadata,
  PROGRAM_ADDRESS as metaplexProgramId,
} from "@metaplex-foundation/mpl-token-metadata";
import collectionDetails from "../../blockend/tokens/collectionNFT/cache.json";
import { Metaplex } from "@metaplex-foundation/js";

export default async function getCollectionNFTs(metaplex: Metaplex) {
  let connection = new Connection(
    `https://solana-devnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_RPC}`,
    "confirmed"
  );
  let collection_id = new PublicKey(collectionDetails.mintAddress);

  console.log("Getting signatures...");
  let allSignatures = [];

  // This returns the first 1000, so we need to loop through until we run out of signatures to get.
  let signatures = await connection.getSignaturesForAddress(collection_id);
  allSignatures.push(...signatures);
  // do {
  //   let options = {
  //     before: signatures[signatures.length - 1].signature,
  //   };
  //   signatures = await connection.getSignaturesForAddress(
  //     collection_id,
  //     options
  //   );
  //   allSignatures.push(...signatures);
  // } while (signatures.length > 0);

  console.log(`Found ${allSignatures.length} signatures`);
  let metadataAddresses = [];
  let mintAddresses = new Set<PublicKey>();

  console.log("Getting transaction data...");
  const promises = allSignatures.map((s) =>
    connection.getTransaction(s.signature)
  );
  const transactions = await Promise.all(promises);

  console.log("Parsing transaction data...");
  for (const tx of transactions) {
    if (tx) {
      let programIds = tx!.transaction.message
        .programIds()
        .map((p) => p.toString());
      let accountKeys = tx!.transaction.message.accountKeys.map((p) =>
        p.toString()
      );

      // Only look in transactions that call the Metaplex token metadata program
      if (programIds.includes(metaplexProgramId)) {
        // Go through all instructions in a given transaction
        for (const ix of tx!.transaction.message.instructions) {
          // Filter for setAndVerify or verify instructions in the Metaplex token metadata program
          if (
            (ix.data == "X" || ix.data == "Z") &&
            accountKeys[ix.programIdIndex] == metaplexProgramId
          ) {
            let metadataAddressIndex = ix.accounts[0];
            let metadata_address =
              tx!.transaction.message.accountKeys[metadataAddressIndex];
            metadataAddresses.push(metadata_address);
          }
        }
      }
    }
  }

  const promises2 = metadataAddresses.map((a) => connection.getAccountInfo(a));
  const metadataAccounts = await Promise.all(promises2);
  for (const account of metadataAccounts) {
    // Burned token addresses are still in metadataAccounts, these are null
    if (account) {
      let metadata = await Metadata.deserialize(account!.data);
      mintAddresses.add(metadata[0].mint);
    }
  }
  let mints: PublicKey[] = Array.from(mintAddresses);

  const bikes = await metaplex.nfts().findAllByMintList({
    mints,
  });

  return bikes;
}
