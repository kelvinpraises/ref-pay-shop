import { initializeApp, getApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

let clientCredentials;

clientCredentials = {
  apiKey: "AIzaSyCo2gMDHlhWekn2A9Q8b1wVtAHE360Yvug",
  authDomain: "reef-pay-shop.firebaseapp.com",
  projectId: "reef-pay-shop",
  storageBucket: "reef-pay-shop.appspot.com",
  messagingSenderId: "189703869550",
  appId: "1:189703869550:web:7179d090dd3fc81381027f"
};

const app = initializeApp(clientCredentials);

if (location.hostname === "localhost") {
  const auth = getAuth(app);
  connectAuthEmulator(auth, "http://localhost:9099", /* { disableWarnings: true } */);

  const functions = getFunctions(getApp());
  connectFunctionsEmulator(functions, "localhost", 5003);

  const db = getFirestore();
  connectFirestoreEmulator(db, "localhost", 8085);
}

export default app;
