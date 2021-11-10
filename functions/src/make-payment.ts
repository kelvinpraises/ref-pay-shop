import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as https from "https";
import { PaymentResponse } from "./types";

// process.env.FIRESTORE_EMULATOR_HOST = "localhost:8085";

admin.initializeApp();

const db = admin.firestore();

export default functions.https.onCall(
  async (
    { id, item, price }: { id: string; item: string; price: string },
    context
  ) => {
    // Call Reef pay API
    const postData = JSON.stringify({
      amount: price,
      successUrl: "http://reef-pay-shop.web.app/success",
      cancelUrl: "http://reef-pay-shop.web.app/canceled",
      callbackUrl: "http://reef-pay-shop.web.app/api/webhook", // TODO: funtions callback
    });

    const options = {
      method: "POST",
      hostname: "reef-pay.web.app", // TODO:
      path: "/api/payment-request",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": "test", // This is the API key from your dashboard
      },
      maxRedirects: 20,
    };

    const body: any = await new Promise((resolve, reject) => {
      const req = https.request(options, function (res) {
        const chunks: any[] = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function () {
          try {
            const body = Buffer.concat(chunks).toString();
            resolve(body);
          } catch (error) {
            reject(error);
          }
        });

        res.on("error", function (error) {
          console.error(error);
          reject(error);
        });
      });

      req.write(postData);

      req.end();
    });

    const parsedBody = JSON.parse(body);

    // Respond back to the shop with the payment link to redirect to.
    if (parsedBody) {
      const { url, transactionId } = parsedBody?.data as PaymentResponse;

      const createdAt = admin.firestore.Timestamp.now();

      await db
        .collection("user")
        .doc(transactionId)
        .set(
          {
            id,
            item,
            price,
            transactionId,
            createdAt,
            status: "pending",
          },
          { merge: true }
        )
        .catch((error) => {
          functions.logger.error(error);
        });

      const response = {
        success: true,
        data: {
          url,
          transactionId,
        },
      };
      return JSON.stringify(response);
    }

    return;
  }
);
