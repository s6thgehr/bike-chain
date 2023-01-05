import type { NextPage } from "next";
import Head from "next/head";
import { BasicsView, YourBikesView } from "../views";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta name="description" content="Your bikes" />
      </Head>
      <YourBikesView />
    </div>
  );
};

export default Basics;
