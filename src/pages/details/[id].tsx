import { Metaplex, Nft, NftWithToken } from "@metaplex-foundation/js";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter, withRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { DetailsView } from "views";

const Details = ({ router: { query } }) => {
  const { connection } = useConnection();
  const [bike, setBike] = useState<NftWithToken>();

  const listing = JSON.parse(query.object);

  // const metaplex = useMemo(() => Metaplex.make(connection), []);

  // useEffect(() => {
  //   const fetchBike = async () => {
  //     const bikeNFT = (await metaplex
  //       .nfts()
  //       .findByMint({ mintAddress: new PublicKey(id) })) as NftWithToken;
  //     setBike(bikeNFT);
  //   };

  //   fetchBike().catch((e) => console.log(e));
  // }, []);

  return <DetailsView listing={listing} />;
};

export default withRouter(Details);
