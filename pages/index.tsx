import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import Shop from "../components/Shop";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Reef Pay Shop | Shop</title>
        <meta name="description" content="A shop integrating reef pay" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Shop />
    </div>
  );
};

export default Home;
