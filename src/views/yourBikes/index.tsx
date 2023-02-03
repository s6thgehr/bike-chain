import { keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, ParsedAccountData, PublicKey } from "@solana/web3.js";
import AddBikeCard from "components/AddBikeCard";
import BikeCard from "components/BikeCard";
import FloatingActionButton from "components/FloatingActionButton";
import { FC, useEffect, useMemo, useState } from "react";
import useBikeStore from "stores/useBikeStore";
import auctionHouseCache from "../../../blockend/auctionHouse/cache.json";

export const YourBikesView: FC = ({}) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [ownListings, setOwnListings] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const metaplex = useMemo(() => Metaplex.make(connection), [connection]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const auctionHouse = await metaplex
        .auctionHouse()
        .findByAddress({ address: new PublicKey(auctionHouseCache.address) });
      const listingsLazy = await metaplex
        .auctionHouse()
        .findListings({ auctionHouse, seller: wallet.publicKey });

      setOwnListings(
        (
          await Promise.all(
            listingsLazy.map(async (l) => {
              const tradeStateAddress = l.tradeStateAddress;
              const listing = await metaplex
                .auctionHouse()
                .findListingByTradeState({ tradeStateAddress, auctionHouse });
              return listing;
            })
          )
        ).filter((l) => {
          return l.purchaseReceiptAddress === null && l.canceledAt === null;
        })
      );

      const purchases = await metaplex
        .auctionHouse()
        .findPurchases({ auctionHouse, buyer: wallet.publicKey });

      setPurchases(
        await Promise.all(
          purchases.map(async (l) => {
            const receiptAddress = l.receiptAddress;
            const listing = await metaplex
              .auctionHouse()
              .findPurchaseByReceipt({ receiptAddress, auctionHouse });
            return listing;
          })
        )
      );
    };
    fetchAccounts();
  }, [wallet]);

  console.log("Own listings: ", ownListings);
  console.log("Own purchases: ", purchases);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col w-screen">
        <h1 className="p-2 text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-secondary to-primary">
          Your Listings
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="mt-16 mb-24 text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-16 justify-start">
          {ownListings.length > 0 &&
            ownListings.map((listing) => {
              return <BikeCard key={listing.asset.address} listing={listing} />;
            })}
        </div>
        {/* <h1 className="p-2 text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-secondary to-primary">
          Your Purchases
        </h1>

        <div className="mt-16 text-center flex flex-row flex-wrap gap-24 justify-start w-full">
          {purchases.length > 0 &&
            purchases.map((listing) => {
              return <BikeCard key={listing.asset.address} listing={listing} />;
            })}
        </div> */}
      </div>
      <FloatingActionButton />
    </div>
  );
};
