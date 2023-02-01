import { createVerifySizedCollectionItemInstruction } from "@metaplex-foundation/mpl-token-metadata";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Signer,
  Transaction,
} from "@solana/web3.js";
import collectionCache from "../../blockend/tokens/collectionNFT/cache.json";

export async function verifySizedCollectionItem(
  connection: Connection,
  metadata: PublicKey
) {
  // TODO: Research better way of private key management
  const secret = JSON.parse(
    process.env.NEXT_PUBLIC_PRIVATE_KEY ?? ""
  ) as number[];
  const secretKey = Uint8Array.from(secret);
  const serverKeypair = Keypair.fromSecretKey(secretKey);

  const instruction = createVerifySizedCollectionItemInstruction({
    metadata: metadata,
    collectionAuthority: new PublicKey(
      collectionCache.nft.updateAuthorityAddress
    ),
    payer: serverKeypair.publicKey,
    collectionMint: new PublicKey(collectionCache.mintAddress),
    collection: new PublicKey(collectionCache.nft.metadataAddress),
    collectionMasterEditionAccount: new PublicKey(
      collectionCache.nft.edition.address
    ),
  });

  const transaction = new Transaction();
  transaction.add(instruction);

  const txSignature = await sendAndConfirmTransaction(connection, transaction, [
    serverKeypair,
  ]);

  console.log("Transaction signature: ", txSignature);
}
