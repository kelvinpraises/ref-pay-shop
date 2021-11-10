import { Functions, getFunctions, httpsCallable } from "firebase/functions";
import React, { useCallback, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { almostBlack } from "../constant/colors";
import app from "../firebase/clientApp";
import Button from "./Button";

const data = [
  {
    id: "mint_icecream",
    name: "Mint and Tard Flavoured Icecream",
    img: "assets/mint_icecream.jpg",
    price: "500",
  },
  {
    id: "aurora_shirt",
    name: "Aurora Shirt",
    img: "assets/aurora_shirt.jpg",
    price: "2000",
  },
  {
    id: "strawberry_icecream",
    name: "Strawberry and Chocolate Flavoured Icecream",
    img: "assets/strawberry_icecream.jpg",
    price: "500",
  },
  {
    id: "white_hood",
    name: "White Marpled Hoddie",
    img: "assets/white_hood.jpg",
    price: "3000",
  },
  {
    id: "colorsplash_hood",
    name: "Color Splash Hoddie",
    img: "assets/colorsplash_hood.jpg",
    price: "3000",
  },
  {
    id: "wolf_shirt",
    name: "Wolf Print Shirt",
    img: "assets/wolf_shirt.jpg",
    price: "2000",
  },
];

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SLoader = styled.div`
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid ${almostBlack};
  min-width: 30px;
  max-width: 30px;
  min-height: 30px;
  animation: ${spin} 2s linear infinite;
`;

export default function Shop() {
  const makePayment = useCallback((id, item, price, setLoading, functions) => {
    setLoading(true);

    if (functions !== null) {
      const makePayment = httpsCallable(functions, "makePayment");
      alert(`your order with is sending`);

      makePayment({ id, item, price })
        .then((result) => {
          console.log(result);

          const response: any = result.data;

          const parsedData = JSON.parse(response);

          const error = response?.error;

          if (parsedData) {
            if (parsedData.success) {
              const { url, transactionId } = parsedData.data;
              alert(
                `your order with id ${transactionId} has been placed you'll be redirected to a pay merchant`
              );

              // redirect to the payment page
              window.location.href = url;
            } else {
              // errors from reef pay
              parsedData.errors.forEach((e: any) => {
                alert(e.message);
              });
            }
          } else if (error) {
            alert(error.errorInfo.message);
          }
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <div>
      {data.map((item) => {
        return ShopItems(item, makePayment);
      })}
    </div>
  );
}

function ShopItems(item: any, makePayment: any): any {
  const [loading, setLoading] = useState(false);

  const [functions, setFunctions] = useState<Functions | null>(null);

  useEffect(() => {
    const functions = getFunctions(app);
    functions && setFunctions(functions);
  }, []);

  return (
    <div
      key={item.id}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "5em",
      }}
    >
      <h2>{item.name}</h2>
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            width: 300,
            minHeight: 300,
            backgroundColor: "gray",
            borderRadius: "15px",
          }}
        >
          <img
            src={item.img}
            alt={item.name}
            style={{
              width: 300,
              borderRadius: "15px",
              filter: loading ? "brightness(40%)" : "brightness(100%)",
            }}
          />
        </div>
        <div
          style={{
            display: loading ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <SLoader />
        </div>
      </div>
      <h4>Reef Price: {item.price} </h4>
      <Button
        click={() =>
          makePayment(item.id, item.name, item.price, setLoading, functions)
        }
        text="Buy"
      />
    </div>
  );
}
