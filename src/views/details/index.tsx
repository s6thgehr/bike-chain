import axios from "axios";
import { FC, useEffect, useState, useMemo } from "react";
import { MetaDataInterface } from "../../../types/MetaDataInterface";
import { useRouter } from "next/router";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  bundlrStorage,
  CreateBidInput,
  DirectBuyInput,
  Metaplex,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { PublicKey, Keypair } from "@solana/web3.js";
import auctionHouseCache from "../../../blockend/auctionHouse/cache.json";

export const DetailsView: FC<{ bike }> = ({ bike }) => {
  const [metaData, setMetaData] = useState<MetaDataInterface>();
  useEffect(() => {
    const fetchMetaData = async () => {
      await axios.get(bike.uri).then((response) => setMetaData(response.data));
    };
    fetchMetaData().catch((e) => console.log(e));
  }, [bike]);

  const router = useRouter();
  const wallet = useWallet();
  const { connection } = useConnection();

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

  async function buy() {
    const auctionHouse = await metaplex
      .auctionHouse()
      .findByAddress({ address: new PublicKey(auctionHouseCache.address) });

    // //TODO: Write function to get server keypair
    // const secret = JSON.parse(
    //   process.env.NEXT_PUBLIC_PRIVATE_KEY ?? ""
    // ) as number[];
    // const secretKey = Uint8Array.from(secret);
    // const keypair = Keypair.fromSecretKey(secretKey);
    const listings = await metaplex
      .auctionHouse()
      .findListings({ auctionHouse, mint: bike.address });

    const bidInput: CreateBidInput = {
      auctionHouse,
      buyer: wallet,
      mintAccount: bike.address,
    };

    // const bidInput: DirectBuyInput = {
    //   auctionHouse,
    //   listing: listings,
    //   buyer: wallet,
    // };

    // metaplex.auctionHouse().buy();
    await metaplex.auctionHouse().bid(bidInput);
  }

  return metaData ? (
    <div className="flex">
      <div className="w-1/2">
        <img src={metaData.image} alt="bike" className="w-full" />
      </div>
      <div className="w-1/2 mx-8 grid grid-rows-5 grid-flow-col gap-4">
        <h2 className="pt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {bike.name}
        </h2>
        <p className="">{metaData.description}</p>
        <div className="flex flex-row">
          <div className="basis-1/2 flex flex-col justify-between">
            <div>
              <div className="font-bold inline">City:</div>{" "}
              {metaData.attributes[1].value}
            </div>
            <div className="mt-8">
              <div className="font-bold inline">Price:</div> $
              {metaData.attributes[2].value}
            </div>
          </div>
          <div className="mx-4">
            <div className="bg-white mx-auto px-4 text-black h-40 w-80 text-center">
              Maps Location
            </div>
          </div>
        </div>

        <label
          onClick={buy}
          htmlFor="my-modal"
          className="btn btn-secondary text-black"
        >
          Buy now
        </label>

        <input type="checkbox" id="my-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Congratulations to your new bike!
            </h3>
            <p className="py-4">
              The combination to unlock the bike lock is: 123456
            </p>
            <div className="modal-action">
              <label htmlFor="my-modal" className="btn">
                Yay!
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading</div>
  );
};
