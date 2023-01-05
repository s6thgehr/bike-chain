import { NextPage } from "next";
import Head from "next/head";
import { AirdropView } from "../views";

const Airdrop: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Bike Chain</title>
        <meta name="description" content="Airdrop" />
      </Head>
      <AirdropView />
    </div>
  );
};

export default Airdrop;
