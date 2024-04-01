import { Router } from "express";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
// import { stripe } from "stripe";
import { createPaymentOrder, sessionTest, createPayment } from "../controllers/PaymentController.js";
import stripePackage from "stripe";
import { v4 as uuidv4 } from 'uuid';
import express from 'express';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
const router = Router();


router.post("/payment", async (req, res) => {
    const userId = await req.session.userId;
  try {
    const {cart, deli_charge, deli_address} = req.body;

    const lineItems = cart.map((item) => {
        return {
            price_data: {
                currency: "thb",
                product_data: {
                    name: item.food.fd_name,
                    // images: [item.food.fd_image],
                },
                unit_amount: item.food.fd_price * 100,
            },
            quantity: item.quantity,
        };
        }
    );

    console.log("lineItems", lineItems);
    const orderId = uuidv4();

    const session = await stripe.checkout.sessions.create({
        // payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        shipping_options: [
            {
                shipping_rate_data
          : {
                  type
          : 'fixed_amount',
                  fixed_amount
          : {
                    amount
          : deli_charge * 100,
                    currency
          : 'thb',
                  },
                  display_name
          : 'By delivery service',
                  delivery_estimate
          : {
                    minimum
          : {
                      unit
          : 'hour',
                      value
          : 1,
                    },
                    maximum
          : {
                      unit
          : 'hour',
                      value
          : 1,
                    },
                  },
                },
              },
        ],
        success_url: `${process.env.FRONTEND_URL}/checkout/payment/success?orderid=${orderId}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout/payment/cancel?orderid=${orderId}`,
    });
    console.log("session", session);
    const order_status = await session.status;
    console.log("order_status", order_status);
    console.log("userId", userId);
    // const newOrder = await createPaymentOrder(req, res, order_status, deli_charge, deli_address, orderId);

    // Send the response to the client
    res.status(200).json({ id: session.id, confirm: "Payment confirmed" });
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
});

router.post("/create-payment", verifyUser, createPayment);

router.post("/session", verifyUser, sessionTest);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_b88602964b2f4bb35a82cef666a86d5e1fe64ab13b27bf18e0a7ab2855c255c3";

// router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
//     const sig = req.headers["stripe-signature"];
  
//     let event;
  
//     try {
//       event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     } catch (err) {
//       res.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }
//     console.log("event", event);
  
//     // Handle the event
//     switch (event.type) {
//       case "checkout.session.completed":
//         const paymentSuccessData = event.data.object;
//         const sessionId = paymentSuccessData.id;
  
//         // const data = {
//         //   status: paymentSuccessData.status,
//         // };
//         const status = paymentSuccessData.status === "complete" ? "RECEIVED" : paymentSuccessData.status;
//         const payMethod = paymentSuccessData.payment_method_types[0];
  
//         // const result = await prisma.order.update({
//         //     where: {
//         //         order_id: sessionId,
//         //     },
//         //     data: {
//         //         order_status: status,
//         //         pay_method: payMethod,
//         //     },
//         //     });
  
//         console.log("=== update result", result, status, payMethod);
  
      
//         break;
//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }
  
//     // Return a 200 response to acknowledge receipt of the event
//     res.send();
//   });

export default router;