import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as express from "express";
const app = express();

const db = admin.firestore();

app.post(
  "/webhook",
  express.json({ type: "application/json" }),
  (request, response) => {
    const { event, transactionId } = request.body;

    // Handle the event
    switch (event.type) {
      case "payment.paid.success":
        // Then call a method to handle the successful payment.
        handleSuccesfullPayment(transactionId);
        break;
      case "payment.overpaid.success":
        // Then call a method to handle the successful payment.
        handleSuccesfullPayment(transactionId);
        break;
      case "payment.unpaid.failed":
        // Then call a method to handle the failed payment.
        handleFailedPayment(transactionId);
        break;
      case "payment.underpaid.failed":
        // Then call a method to handle the failed payment.
        handleFailedPayment(transactionId);
        break;

      // Also handle other event types
      default:
        console.log(`Unhandled event type ${event}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
  }
);

const main = express();
main.use("/api", app);

export default functions.https.onRequest(main);
async function handleSuccesfullPayment(transactionId: string) {
  await db
    .collection("user")
    .doc(transactionId)
    .set(
      {
        status: "success",
      },
      { merge: true }
    )
    .catch((error) => {
      functions.logger.error(error);
    });
}

async function handleFailedPayment(transactionId: string) {
  await db
    .collection("user")
    .doc(transactionId)
    .set(
      {
        status: "failed",
      },
      { merge: true }
    )
    .catch((error) => {
      functions.logger.error(error);
    });
}
