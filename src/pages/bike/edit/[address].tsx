import BikeForm from "../../../components/BikeForm";
import { useRouter } from "next/router";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  bundlrStorage,
  Metaplex,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { verifySizedCollectionItem } from "utils/verifySizedCollectionItem";
import { createBikeListing } from "utils/createBikeListing";
import collectionCache from "../../../../blockend/tokens/collectionNFT/cache.json";
import { dollarToSol } from "utils/dollarToSol";
import auctionHouseCache from "../../../../blockend/auctionHouse/cache.json";

function EditBike() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const { address } = router.query;
  const [bike, setBike] = useState<any>();

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

  // TODO: Research better way of private key management
  const secret = JSON.parse(
    process.env.NEXT_PUBLIC_PRIVATE_KEY ?? ""
  ) as number[];
  const secretKey = Uint8Array.from(secret);
  const serverKeypair = Keypair.fromSecretKey(secretKey);

  useEffect(() => {
    const fetchBike = async () => {
      const auctionHouse = await metaplex
        .auctionHouse()
        .findByAddress({ address: new PublicKey(auctionHouseCache.address) });
      const bikeLazy = await metaplex
        .auctionHouse()
        .findListings({ auctionHouse, mint: new PublicKey(address) });
      const tradeStateAddress = bikeLazy[0].tradeStateAddress;
      const bike = await metaplex
        .auctionHouse()
        .findListingByTradeState({ tradeStateAddress, auctionHouse });

      setBike(bike);

      console.log(bike);
    };
    fetchBike();
  }, [wallet]);

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

    console.log("Updating bicycle NFT...");
    await metaplex.nfts().update({
      nftOrSft: bike.asset,
      uri: uri,
      name: formData.model,
      updateAuthority: serverKeypair,
    });
    console.log("Bicycle NFT updated.");

    // console.log("Verify bicycle NFT...");
    // await verifySizedCollectionItem(connection, nft.metadataAddress);
    // console.log("Bicycle NFT verified.");

    console.log("Creating listing...");
    const createListingOutput = await createBikeListing(
      metaplex,
      wallet.publicKey,
      bike.asset.address,
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
      {bike && (
        <BikeForm
          formData={{
            model: bike?.asset.json.name,
            type: bike?.asset.json.attributes[0].value,
            description: bike?.asset.json.description,
            imageUrl: bike?.asset.json.image,
            city: bike?.asset.json.attributes[1].value,
            price: bike?.asset.json.attributes[2].value,
            combination: "",
          }}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default EditBike;
