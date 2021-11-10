import { Auth, getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import app from "../firebase/clientApp";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }: { children: any }) {
  const router = useRouter();

  const childElement = useRef<HTMLDivElement | null>(null);

  const [name, setName] = useState("null");
  const [displayName, setDisplayName] = useState("null");

  const [show, setShow] = useState(false);

  useEffect(() => {
    const topPos = childElement.current as HTMLElement;
    topPos.scrollIntoView();
  }, [router]);

  useEffect(() => {
    const split = router.pathname.split("/")[1];

    switch (split) {
      case "overview":
        setName("Overview");
        break;
      case "transactions":
        setName("Transactions");
        break;
      case "settings":
        setName("Settings");
        break;
      case "documentation":
        setName("API Doc");
        break;
      case "pay":
        setName("Payment Request");
        break;

      default:
        break;
    }
  }, [router]);

  const setActive = useCallback(
    (iconName: string) => {
      return iconName === name ? true : false;
    },
    [name, router]
  );

  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    auth && setAuth(auth);
  }, []);

  useEffect(() => {
    if (auth !== null) {
      onAuthStateChanged(auth, async (user) => {
        if (user && user.displayName !== null) {
          setDisplayName(user.displayName);
        }
      });
    }
  }, [auth]);

  return (
    <div style={{ backgroundColor: "aliceblue" }}>
      <Header />
      <br />
      <br />
      <div ref={childElement}>{children}</div>
      <br />
      <br />
      <Footer />
    </div>
  );
}
