import { Router } from "express";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
// import { stripe } from "stripe";
import stripePackage from "stripe";

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
const router = Router();

router.post("/payment", async (req, res) => {
  try {
    const {cart} = req.body;

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

    const session = await stripe.checkout.sessions.create({
        // payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/checkout/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout/payment/cancel`,
    });
    console.log("session", session);


    // Send the response to the client
    res.status(200).json({ id: session.id, confirm: "Payment confirmed" });
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
});

export default router;