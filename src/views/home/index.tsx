// Next, React
import { FC, useEffect, useMemo } from "react";

// Wallet
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import pkg from "../../../package.json";
// import { bikes } from "data/bikes";
import BikeCard from "components/BikeCard";
import Link from "next/link";
import { Metaplex } from "@metaplex-foundation/js";
import getCollectionNFTs from "utils/getCollectionNFTs";
import useBikeStore from "stores/useBikeStore";
import axios from "axios";

// const bikesData = bikes;

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const setBikes = useBikeStore((state) => state.setBikes);
  const bikes = useBikeStore((state) => state.bikes);

  const metaplex = useMemo(() => Metaplex.make(connection), [connection]);

  useEffect(() => {
    const fetchData = async () => {
      const bikeData = await getCollectionNFTs(metaplex);
      setBikes(bikeData);
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
              {bikes.map((data) => {
                return <BikeCard key={data.address} data={data} />;
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
