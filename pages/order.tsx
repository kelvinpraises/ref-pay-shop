import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import Orders from "../components/Orders";
import { IOrder } from "../models/orders";

const date = new Date();
const orders = Array<IOrder>(10).fill({
  id: "Hse98eudolms",
  item: "soup",
  amount: "50000",
  status: "pending",
  createdAt: date.toLocaleDateString(),
});
const Order: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Reef Pay Shop | Order</title>
        <meta name="description" content="A shop integrating reef pay" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Orders />
    </div>
  );
};

export default Order;
