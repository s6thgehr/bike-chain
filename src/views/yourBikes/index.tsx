import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ParsedAccountData, PublicKey } from "@solana/web3.js";
import AddBikeCard from "components/AddBikeCard";
import BikeCard from "components/BikeCard";
import { on } from "process";
import { FC, useEffect, useState } from "react";
import useBikeStore from "stores/useBikeStore";

export const YourBikesView: FC = ({}) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const bikes = useBikeStore((state) => state.bikes);

  const [ownBikes, setOwnBikes] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const results = await Promise.all(
        bikes.map(async (bike) => {
          const largestAccounts = await connection.getTokenLargestAccounts(
            new PublicKey(bike.mintAddress)
          );
          const largestAccountInfo = await connection.getParsedAccountInfo(
            largestAccounts.value[0].address
          );
          return (
            (largestAccountInfo.value.data as ParsedAccountData).parsed.info
              .owner === wallet.publicKey.toBase58()
          );
        })
      );
      const filteredBikes = bikes.filter((_, index) => results[index]);
      console.log("Filtered bikes: ", filteredBikes);
      setOwnBikes(filteredBikes);
    };
    fetchAccounts();
  }, [wallet]);

  return (
    ownBikes && (
      <div className="md:hero mx-auto p-4">
        <div className="md:hero-content flex flex-col w-screen">
          <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
            Your Bikes
          </h1>
          {/* CONTENT GOES HERE */}
          <div className="mt-16 text-center flex flex-row flex-wrap gap-24 justify-start w-full">
            <AddBikeCard />

            {ownBikes.length > 0 &&
              ownBikes.map((bike) => {
                return <BikeCard key={bike.mintAddress} data={bike} />;
              })}
          </div>
        </div>
      </div>
    )
  );
};
