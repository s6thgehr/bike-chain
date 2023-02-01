import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  NftWithToken,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { initializeKeypair } from "../../utils/initializeKeypair";
import * as fs from "fs";

const tokenName = "Bike-Chain NFT";
const description = "Collection NFT of Bike NFTs";
const symbol = "BKC";
const sellerFeeBasisPoints = 0;
const imageFile = "collection.jpeg";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const wallet = await initializeKeypair(connection);

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );

  // file to buffer
  const buffer = fs.readFileSync("assets/" + imageFile);

  // buffer to metaplex file
  const file = toMetaplexFile(buffer, imageFile);

  //upload image and get image uri
  const imageUri = await metaplex.storage().upload(file);
  console.log("image uri: ", imageUri);

  // upload metadata and get metadata uri (off chain metadata)
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: tokenName,
    description: description,
    image: imageUri,
  });
  console.log("metadata uri:", uri);

  // const mintAddress = new PublicKey(
  //   "2ULpn2o8yVFbvSumUWHXiZPifk76W2jGU59Vy5v9z2zP"
  // );
  const nft = await createNft(metaplex, uri);
  // const nft = (await updateNft(metaplex, uri, mintAddress)) as NftWithToken;

  fs.writeFileSync(
    "blockend/tokens/collectionNFT/cache.json",
    JSON.stringify({
      mintAddress: nft.address.toBase58(),
      nft: nft,
    })
  );
}

// create NFT
async function createNft(
  metaplex: Metaplex,
  uri: string
): Promise<NftWithToken> {
  const { nft } = await metaplex.nfts().create({
    uri: uri,
    name: tokenName,
    sellerFeeBasisPoints: sellerFeeBasisPoints,
    symbol: symbol,
    isCollection: true,
  });

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  );

  return nft;
}

async function updateNft(
  metaplex: Metaplex,
  uri: string,
  mintAddress: PublicKey
) {
  // get "NftWithToken" type from mint address
  const nft = await metaplex.nfts().findByMint({ mintAddress });

  // omit any fields to keep unchanged
  await metaplex.nfts().update({
    nftOrSft: nft,
    name: tokenName,
    symbol: symbol,
    uri: uri,
    sellerFeeBasisPoints: sellerFeeBasisPoints,
  });

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  );

  return nft;
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
