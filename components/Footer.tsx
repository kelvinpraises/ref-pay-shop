import React from "react";
import styles from "../styles/x.module.css";

function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <div className={styles.Appfooter}>
      <p>Open-Source {year} Reef Pay Shop</p>
    </div>
  );
}

export default Footer;
