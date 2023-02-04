import {
  keypairIdentity,
  Metaplex,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, ParsedAccountData, PublicKey } from "@solana/web3.js";
import AddBikeCard from "components/AddBikeCard";
import BikeCard from "components/BikeCard";
import FloatingActionButton from "components/FloatingActionButton";
import { FC, useEffect, useMemo, useState } from "react";
import useBikeStore from "stores/useBikeStore";
import auctionHouseCache from "../../../blockend/auctionHouse/cache.json";
import getCollectionNFTs from "utils/getCollectionNFTs";
import { useRouter } from "next/router";
import { BiHide, BiShow } from "react-icons/bi";
var CryptoJS = require("crypto-js");

export const YourBikesView: FC = ({}) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [ownListings, setOwnListings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [ownBikes, setOwnBikes] = useState([]);
  const [showCombination, setShowCombination] = useState(false);
  const router = useRouter();

  const metaplex = useMemo(
    () => Metaplex.make(connection).use(walletAdapterIdentity(wallet)),
    [connection, wallet]
  );

  // TODO: Catch NFTs from collection and then check if they are listed instead of catching NFTs from auction house
  useEffect(() => {
    const fetchAccounts = async () => {
      const auctionHouse = await metaplex
        .auctionHouse()
        .findByAddress({ address: new PublicKey(auctionHouseCache.address) });
      const listingsLazy = await metaplex
        .auctionHouse()
        .findListings({ auctionHouse, seller: wallet.publicKey });

      const listings = await Promise.all(
        listingsLazy
          .filter((l) => {
            return l.purchaseReceiptAddress === null;
          })
          .map(async (l) => {
            const tradeStateAddress = l.tradeStateAddress;
            const listing = await metaplex
              .auctionHouse()
              .findListingByTradeState({ tradeStateAddress, auctionHouse });
            // if (listing.canceledAt === null) {
            //   return { ...listing.asset, forSale: true };
            // } else {
            //   return { ...listing.asset, forSale: false };
            // }
            return listing;
          })
      );
      const purchasesLazy = await metaplex
        .auctionHouse()
        .findPurchases({ auctionHouse, buyer: wallet.publicKey });

      const purchases = await Promise.all(
        purchasesLazy.map(async (l) => {
          const receiptAddress = l.receiptAddress;
          const listing = await metaplex
            .auctionHouse()
            .findPurchaseByReceipt({ receiptAddress, auctionHouse });
          // return { ...listing.asset, forSale: false };
          return listing;
        })
      );
      setOwnBikes([...listings, ...purchases]);
    };
    fetchAccounts();
  }, [wallet]);

  console.log("Own bikes: ", ownBikes);
  // console.log("Own purchases: ", purchases);

  const cancelListing = async (l) => {
    const auctionHouse = await metaplex
      .auctionHouse()
      .findByAddress({ address: new PublicKey(auctionHouseCache.address) });
    await metaplex.auctionHouse().cancelListing({
      auctionHouse, // The Auction House in which to cancel listing
      listing: l, // The listing to cancel
    });
  };

  const listBike = async (bikeAddress) => {
    router.push(`/bike/edit/${bikeAddress}`);
  };

  function decryptCombination(encrypted) {
    return CryptoJS.AES.decrypt(
      encrypted,
      process.env.NEXT_PUBLIC_ENCRYPTION_PHRASE
    ).toString(CryptoJS.enc.Utf8);
  }

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col w-screen">
        <h1 className="p-2 text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-secondary to-primary">
          Your Bikes
        </h1>
        {/* CONTENT GOES HERE */}
        {/* <div className="mt-6 mr-8 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {ownListings.length > 0 &&
            ownListings.map((listing) => {
              return <BikeCard key={listing.asset.address} listing={listing} />;
            })}
        </div> */}
        <div className="overflow-x-auto w-full mb-16">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>
                  Combination{" "}
                  <button
                    onClick={() =>
                      setShowCombination((prevState) => !prevState)
                    }
                    className="btn btn-ghost btn-sm items-center"
                  >
                    {showCombination ? <BiShow /> : <BiHide />}
                  </button>
                </th>
                <th>Location</th>
                <th>For Sale?</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ownBikes.length > 0 &&
                ownBikes.map((bike) => {
                  const forSale =
                    bike.purchaseReceiptAddress === null &&
                    bike.canceledAt === null;
                  return (
                    <tr key={bike.asset.address}>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img
                                src={bike.asset.json.image}
                                alt="Bike image"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              {bike.asset.json.name}
                            </div>
                            <div className="text-sm opacity-50">
                              {bike.asset.json.attributes[0].value}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          {showCombination
                            ? decryptCombination(
                                bike.asset.json.attributes[3].value
                              )
                            : "⚫ ⚫ ️⚫ ️⚫️ ⚫️️"}
                        </div>
                      </td>
                      <td>{bike.asset.json.attributes[1].value}</td>
                      <td>
                        {forSale ? (
                          <div>
                            Yes
                            <br />
                            <span className="badge badge-ghost badge-sm">
                              $ {bike.asset.json.attributes[2].value}
                            </span>
                          </div>
                        ) : (
                          "No"
                        )}
                      </td>
                      <th>
                        <button
                          onClick={() => {
                            if (forSale) {
                              cancelListing(bike);
                            } else {
                              listBike(bike.asset.address);
                            }
                          }}
                          className="btn btn-ghost btn-xs"
                        >
                          {forSale ? "Unlist bicycle" : "List bicycle"}
                        </button>
                      </th>
                    </tr>
                  );
                })}
            </tbody>
          </table>
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
