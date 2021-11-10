import {
  collection,
  Firestore,
  getFirestore,
  onSnapshot,
  query
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { almostBlack } from "../constant/colors";
import app from "../firebase/clientApp";
import { IOrder } from "../models/orders";
import { ITableRow, Table } from "./Table";

export interface IOrders {
  orders: Array<IOrder>;
}

const SOrders = styled.section`
  padding: 1em;
`;

const SBox = styled.div`
  max-height: 400px;
  display: grid;
  place-items: center;
`;

export default function Orders() {
  const [db, setDb] = useState<Firestore | null>(null);
  const [orders, setOrder] = useState<IOrder[]>([]);

  useEffect(() => {
    const db = getFirestore(app);
    db && setDb(db);
  }, []);

  useEffect(() => {
    if (db !== null) {
      const q = query(collection(db, "user"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        const order: IOrder[] = [...orders];
        querySnapshot.forEach((doc) => {
          const { id, item, price, status, createdAt } = doc.data();
          const date = createdAt.toDate().toDateString();
          order.push({
            id,
            item,
            amount: price,
            status,
            createdAt: date,
          });
        });
        setOrder(order);
      });

      return () => unsub();
    }
  }, [db]);

  const { tableRows } = useMemo(() => {
    const _orders: any = orders.map(
      ({ amount, status, item, createdAt }, index) => ({
        no: index + 1,
        item,
        amount,
        status,
        date: createdAt,
      })
    );

    let count = 0;

    const tableRows: ITableRow<IOrder> = new Map();

    for (const investment of _orders) {
      const investmentElements: Array<JSX.Element> = Object.keys(
        investment
      ).map((investmentKey) => {
        const investmentData: IOrder = investment[investmentKey];
        return <>{investmentData}</>;
      });

      tableRows.set(investment + count, {
        data: investment,
        elements: investmentElements,
      });

      count += 1;
    }

    return { tableRows };
  }, [orders]);

  if (orders.length < 1) {
    return (
      <SOrders>
        <SBox>
          <div
            style={{
              height: "80vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <h1
                style={{
                  color: almostBlack,
                  textAlign: "center",
                  fontSize: "2rem",
                }}
              >
                Hi there, you have no orders yet.
              </h1>
              <br />
              <h5
                style={{
                  color: almostBlack,
                  textAlign: "center",
                  fontSize: "1.3rem",
                }}
              >
                Your orders show up when they&apos;re made
              </h5>
            </div>
          </div>
        </SBox>
      </SOrders>
    );
  } else {
    return (
      <SOrders>
        <Table<IOrder> key="" data={tableRows} />
      </SOrders>
    );
  }
}
