import BikeForm from "../../components/BikeForm";
import { useRouter } from "next/router";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  bundlrStorage,
  Metaplex,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import useBikeStore from "stores/useBikeStore";
import { verifySizedCollectionItem } from "utils/verifySizedCollectionItem";
import { createBikeListing } from "utils/createBikeListing";
import collectionCache from "../../../blockend/tokens/collectionNFT/cache.json";
import { dollarToSol } from "utils/dollarToSol";

function NewBike() {
  const router = useRouter();
  const wallet = useWallet();
  const { connection } = useConnection();
  const addBike = useBikeStore((state) => state.addBike);

  // TODO: Use metaplex provider instead and wrap it around app
  const metaplex = useMemo(
    () =>
      Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(
          bundlrStorage({
            address: "https://devnet.bundlr.network",
            providerUrl: "https://api.devnet.solana.com",
            timeout: 60000,
          })
        ),
    [connection, wallet]
  );

  async function handleSubmit(formData) {
    const { uri } = await metaplex.nfts().uploadMetadata({
      name: formData.model,
      description: formData.description,
      image: formData.imageUrl,
      attributes: [
        { trait_type: "bike_type", value: formData.type },
        { trait_type: "city", value: formData.city },
        { trait_type: "price", value: formData.price },
        { trait_type: "combination", value: formData.combination },
      ],
    });

    console.log("Creating bicycle NFT...");
    const { nft } = await metaplex.nfts().create({
      uri: uri,
      name: formData.model,
      sellerFeeBasisPoints: 0,
      collection: new PublicKey(collectionCache.mintAddress),
    });
    console.log("Bicycle NFT created.");

    console.log("Verify bicycle NFT...");
    await verifySizedCollectionItem(connection, nft.metadataAddress);
    console.log("Bicycle NFT verified.");

    console.log("Creating listing...");
    const createListingOutput = await createBikeListing(
      metaplex,
      wallet.publicKey,
      nft.address,
      dollarToSol(Number(formData.price))
    );
    console.log("Listing created.");
    // addBike and setBikes use different data formats
    // addBike(nft);

    console.log("Listing Output: ", createListingOutput);

    router.push("/your-bikes");
  }

  return (
    <div className="flex justify-center my-16">
      <BikeForm
        formData={{
          model: "",
          type: "",
          description: "",
          imageUrl: "",
          city: "",
          price: "",
          combination: "",
        }}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default NewBike;
