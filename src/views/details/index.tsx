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
    <div className="grid grid-cols-3 m-8 bg-base-100">
      <div className="aspect-[4/3]">
        <img
          src={listing.asset.json.image}
          alt="bike"
          className="w-full rounded-lg"
        />
      </div>
      <div className="col-span-2 mx-8">
        <h2 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
          {listing.asset.json.name}
        </h2>
        <div className="badge badge-accent mb-4">
          {listing.asset.json.attributes[0].value}
        </div>
        <p className="">
          {listing.asset.json.description} asfjl l;asfjl asfjlka sdfjlaks;jf
          lkasjf lkasdjflkasdjflkasj flkjasdlkf jaslkfjaslkfjasl kfjlaksj falsjf
          lsajfl kasjflkasjfl jflsk
        </p>
        <div className="flex flex-row">
          <div className="basis-1/2 justify-between">
            <div className="bg-white text-black h-40 w-80 text-center mt-8">
              <img src="/maps.png" className="rounded-md" />
            </div>
          </div>
          <div>
            <div className="my-8">
              <div className="font-bold inline">Price:</div> $
              {listing.asset.json.attributes[2].value}
            </div>
            <div>
              <label
                onClick={buy}
                htmlFor="my-modal"
                className="btn btn-secondary text-black"
              >
                Buy now
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
