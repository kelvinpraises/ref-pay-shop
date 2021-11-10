import Link from "next/link";
import React from "react";
import styles from "../styles/x.module.css";

const style = {
  color: "white",
};

function Header() {
  return (
    <div className={styles.Appheader}>
      <ul className={styles.Headernav}>
        <Link passHref={true} href="/">
          <a style={{ textDecoration: "none" }}>
            <li style={style}>Shop</li>
          </a>
        </Link>
        <Link passHref={true} href="/order">
          <a style={{ textDecoration: "none" }}>
            <li style={style}>Order</li>
          </a>
        </Link>
        {/* <Link passHref={true} href="/about">
          <a style={{ textDecoration: "none" }}>
            <li style={style}>About</li>
          </a>
        </Link> */}
      </ul>
    </div>
  );
}

export default Header;
