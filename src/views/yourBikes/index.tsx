import { keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, ParsedAccountData, PublicKey } from "@solana/web3.js";
import AddBikeCard from "components/AddBikeCard";
import BikeCard from "components/BikeCard";
import { FC, useEffect, useMemo, useState } from "react";
import useBikeStore from "stores/useBikeStore";
import auctionHouseCache from "../../../blockend/auctionHouse/cache.json";

export const YourBikesView: FC = ({}) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [ownListings, setOwnListings] = useState([]);

  const metaplex = useMemo(() => Metaplex.make(connection), [connection]);

  useEffect(() => {
    const fetchAccounts = async () => {
      // const results = await Promise.all(
      //   bikes.map(async (bike) => {
      //     console.log(bike);
      //     const largestAccounts = await connection.getTokenLargestAccounts(
      //       new PublicKey(bike.mintAddress)
      //     );
      //     const largestAccountInfo = await connection.getParsedAccountInfo(
      //       largestAccounts.value[0].address
      //     );
      //     return (
      //       (largestAccountInfo.value.data as ParsedAccountData).parsed.info
      //         .owner === wallet.publicKey.toBase58()
      //     );
      //   })
      // );
      // const filteredBikes = bikes.filter((_, index) => results[index]);

      // setOwnBikes(filteredBikes);

      const auctionHouse = await metaplex
        .auctionHouse()
        .findByAddress({ address: new PublicKey(auctionHouseCache.address) });
      const listingsLazy = await metaplex
        .auctionHouse()
        .findListings({ auctionHouse, seller: wallet.publicKey });
      setOwnListings(
        await Promise.all(
          listingsLazy.map(async (l) => {
            const tradeStateAddress = l.tradeStateAddress;
            const listing = await metaplex
              .auctionHouse()
              .findListingByTradeState({ tradeStateAddress, auctionHouse });
            return listing;
          })
        )
      );
    };
    fetchAccounts();
  }, [wallet]);

  console.log("Own listings: ", ownListings);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col w-screen">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Your Bikes
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="mt-16 text-center flex flex-row flex-wrap gap-24 justify-start w-full">
          <AddBikeCard />

          {ownListings.length > 0 &&
            ownListings.map((listing) => {
              return <BikeCard key={listing.asset.address} listing={listing} />;
            })}
        </div>
      </div>
    </div>
  );
};
