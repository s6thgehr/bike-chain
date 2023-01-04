import { createVerifySizedCollectionItemInstruction } from "@metaplex-foundation/mpl-token-metadata";
import {
    Connection,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    Signer,
    Transaction,
} from "@solana/web3.js";

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
            "D5imPvkMw6nvPPAJccAspxbtRZKtaDcGwu7hoNWHFk39"
        ),
        payer: serverKeypair.publicKey,
        collectionMint: new PublicKey(
            "2ULpn2o8yVFbvSumUWHXiZPifk76W2jGU59Vy5v9z2zP"
        ),
        collection: new PublicKey(
            "GPnWmX87UX24U5xe2quf5hAMKtMvpvfAfLG42jdpNkeG"
        ),
        collectionMasterEditionAccount: new PublicKey(
            "3yRrcyTRzjpPNir9txQQum9iKeM1AXQYdXqxe2T17vmf"
        ),
    });

    const transaction = new Transaction();
    transaction.add(instruction);

    const txSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [serverKeypair]
    );

    console.log("Transaction signature: ", txSignature);
}
