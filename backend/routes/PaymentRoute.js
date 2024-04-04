import { Router } from "express";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import {
  createPaymentOrder,
  sessionTest,
  createPayment,
} from "../controllers/PaymentController.js";
import { deactivateShoppingCart } from "../controllers/OrderController.js";
import stripePackage from "stripe";
import { v4 as uuidv4 } from "uuid";
import express from "express";

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
const router = Router();

router.post("/create-payment", verifyUser, createPayment, deactivateShoppingCart);

router.post("/session", verifyUser, sessionTest);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_b88602964b2f4bb35a82cef666a86d5e1fe64ab13b27bf18e0a7ab2855c255c3";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const rawBody = req.body; // Convert the raw body to a string

    // console.log("Received webhook event:", rawBody);

    let event = req.body;

    // try {
    //   event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    // } catch (err) {
    //   res.status(400).send(`Webhook Error: ${err.message}`);
    //   return;
    // }

    // console.log("event type", rawBody.type);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        // console.log("event", event);
        const paymentSuccessData = event.data.object;
        const session_Id = paymentSuccessData.id;

        // const data = {
        //   status: paymentSuccessData.status,
        // };
        const status =
          paymentSuccessData.status === "complete"
            ? "RECEIVED"
            : paymentSuccessData.status;
        // const payMethod = "";

        try {
          const result = await prisma.order.update({
            where: {
              sessionId: session_Id,
            },
            data: {
              order_status: status,
              // pay_method: payMethod,
            },
          });

          // Deactivate shopping cart
          await deactivateShoppingCart();
          console.log("=== update result", result, status);
        } catch (error) {
          console.log(error);
          return res.status(400).json({
            message: error.message,
          });
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  },
);

export default router;
