// Next, React
import { FC, useEffect, useMemo, useState } from "react";

// Wallet
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import pkg from "../../../package.json";
import BikeCard from "components/BikeCard";
import { Metaplex } from "@metaplex-foundation/js";
import auctionHouseCache from "../../../blockend/auctionHouse/cache.json";
import { PublicKey } from "@solana/web3.js";

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [listings, setListings] = useState([]);

  const metaplex = useMemo(() => Metaplex.make(connection), [connection]);

  useEffect(() => {
    const fetchData = async () => {
      const auctionHouse = await metaplex
        .auctionHouse()
        .findByAddress({ address: new PublicKey(auctionHouseCache.address) });
      const listings = await metaplex
        .auctionHouse()
        .findListings({ auctionHouse });

      setListings(
        (
          await Promise.all(
            listings.map(async (l) => {
              const tradeStateAddress = l.tradeStateAddress;
              const listing = await metaplex
                .auctionHouse()
                .findListingByTradeState({ tradeStateAddress, auctionHouse });
              // console.log("Listings: ", listing);
              return listing;
            })
          )
        ).filter((l) => {
          return l.purchaseReceiptAddress === null && l.canceledAt === null;
        })
      );
    };
    fetchData().catch((e) => console.log(e));
  }, []);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Bike Chain{" "}
          <span className="text-sm font-normal align-top text-slate-700">
            v{pkg.version}
          </span>
        </h1>
        <h4 className="md:w-full text-center text-slate-300 my-2">
          <p>Sell your bike without being on site.</p>
          <p>Or buy a bike directly on the street.</p>
        </h4>
        {wallet.connected ? (
          <div className="mx-auto max-w-2xl py-4 px-4 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-white">
              Bikes for Sale
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {listings.map((listing) => {
                return (
                  <BikeCard key={listing.asset.address} listing={listing} />
                );
              })}
            </div>
          </div>
        ) : (
          <div>Connect your wallet and let's go!</div>
        )}
      </div>
    </div>
  );
};
