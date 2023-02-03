import { FC, useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  DirectBuyInput,
  Metaplex,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import auctionHouseCache from "../../../blockend/auctionHouse/cache.json";

export const DetailsView: FC<{ listing }> = ({ listing }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const metaplex = useMemo(
    () => Metaplex.make(connection).use(walletAdapterIdentity(wallet)),
    [connection, wallet]
  );

  console.log("buy: ", listing);

  async function buy() {
    const auctionHouse = await metaplex
      .auctionHouse()
      .findByAddress({ address: new PublicKey(auctionHouseCache.address) });
    console.log("AuctionHouse: ", auctionHouse);

    // Somehow I need to fetch the listing again with findByReceipt, otherwise I get errors
    const l = await metaplex.auctionHouse().findListingByReceipt({
      auctionHouse,
      receiptAddress: new PublicKey(listing.receiptAddress),
    });
    console.log("After ReceiptAddress: ", l);

    const buyInput: DirectBuyInput = {
      auctionHouse,
      listing: l,
      buyer: metaplex.identity(),
      price: l.price,
    };

    await metaplex.auctionHouse().buy(buyInput);
  }

  return (
    <div className="flex">
      <div className="w-1/2">
        <img src={listing.asset.json.image} alt="bike" className="w-full" />
      </div>
      <div className="w-1/2 mx-8 grid grid-rows-5 grid-flow-col gap-4">
        <h2 className="pt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {listing.asset.json.name}
        </h2>
        <p className="">{listing.asset.json.description}</p>
        <div className="flex flex-row">
          <div className="basis-1/2 flex flex-col justify-between">
            <div>
              <div className="font-bold inline">City:</div>{" "}
              {listing.asset.json.attributes[1].value}
            </div>
            <div className="mt-8">
              <div className="font-bold inline">Price:</div> $
              {listing.asset.json.attributes[2].value}
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
  );
};
