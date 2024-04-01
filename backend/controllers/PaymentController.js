import prisma from "../DB/db.config.js";
import stripePackage from "stripe";

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

const findUniqueOrderId = async () => {
    try {
        // Find the last order ID in the database
        const lastOrder = await prisma.order.findFirst({
            orderBy: { order_id: 'desc' },
        });
        // console.log("lastOrder", lastOrder);

        let newOrderId;
        if (lastOrder) {
            // Increment the last order ID by 1
            newOrderId = lastOrder.order_id + 1;
        } else {
            // If there are no orders in the database, start from 1
            newOrderId = 1;
        }
        // console.log("newOrderId", newOrderId);
        return newOrderId;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

export const createPayment = async (req, res) => {
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
        const orderId = parseInt( await findUniqueOrderId());
        // console.log("orderId", orderId);

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
        // const order_status = await session.status;
        // Retrieve the session object using the session ID
        const retrievedSession = await stripe.checkout.sessions.retrieve(session.id);

        // Get the status from the retrieved session object
        const order_status = retrievedSession.payment_status;
        console.log("order_status", order_status);
        console.log("userId", userId);
        const orderStatus = order_status === "paid" ? "PAID" : "PENDING";
        const sessionId = session.id;
        // const newOrder = await createPaymentOrder(req, res, orderStatus, deli_charge, deli_address, orderId);

        await createPaymentOrder2(userId, deli_address, deli_charge, orderStatus, orderId, sessionId);

        // Send the response to the client
        return res.status(200).json({ id: session.id, confirm: "Payment confirmed" });
    // return res.status(200).json({ message: "Payment successful", lineItems });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: error.message,
      });
    }
}

export const sessionTest = async (req, res) => {
    const userId = req.session.userId;
    console.log("userId", userId);
    res.status(200).json({ message: "Session test successful", userId});
    return;
}

export const createPaymentOrder2 = async (userId, deli_address, deli_charge, orderStatus, orderId, sessionId) => {
    try {
        // empty order
        const newOrder = await prisma.order.create({
            data: {
                order_id: orderId,
                user: { connect: { user_id: userId } },
                deli_charge: deli_charge,
                order_total: 0,
                deli_address: deli_address,
                pay_method: "ONLINEPAYMENT",
                order_status: orderStatus,
                sessionId: sessionId,
            },
        });

        // get the user's shopping cart
        const shoppingCart = await prisma.shoppingCart.findFirst({
            where: {
                cart_user_id: userId,
                cart_active: true,
            },
            include: {
                cart_items: true,
            },
        });

        if (!shoppingCart) {
            return res.status(404).json({ error: "Shopping cart not found" });
        }

        // create the order
        const orderItems = await Promise.all(shoppingCart.cart_items.map(async (cartItem) => {
            // Create the order item
            const newOrderItem = await prisma.orderItem.create({
                data: {
                    quantity: cartItem.quantity,
                    orderit_total: cartItem.cartit_total,
                    order: {
                        connect: { order_id: newOrder.order_id },
                    },
                    food: {
                        connect: { fd_id: cartItem.cartit_food_id },
                    },
                },
            });
            return newOrderItem;
        }));
        // update order total
        const orderTotal = orderItems.reduce((acc, item) => acc + item.orderit_total, 0);
        await prisma.order.update({
            where: { order_id: newOrder.order_id },
            data: { order_total: orderTotal + deli_charge },
        });

        // // Deactivate shopping cart
        // await prisma.shoppingCart.update({
        //     where: { cart_id: shoppingCart.cart_id },
        //     data: { cart_active: false },
        // });
        console.log("newOrder", newOrder);
    } catch (error) {
        console.error("Error creating payment order:", error);
        throw error; // Optionally rethrow the error to handle it elsewhere
    }
};

export const createPaymentOrder = async (req, res) => {
    const userId = req.session.userId;
    const { deli_address, deli_charge, orderStatus } = req.body;

    try {
        console.log("order_status", orderStatus);
        // // empty order
        // const newOrder = await prisma.order.create({
        //     data: {
        //         user: { connect: { user_id: userId } },
        //         deli_charge: deli_charge,
        //         order_total: 0,
        //         deli_address: deli_address,
        //         pay_method: "CREDITCARD",
        //         order_status: order_status,
        //     },
        // });

        // // get the user's shopping cart
        // const shoppingCart = await prisma.shoppingCart.findFirst({
        //     where: {
        //         cart_user_id: userId,
        //         cart_active: true,
        //     },
        //     include: {
        //         cart_items: true,
        //     },
        // });

        // if (!shoppingCart) {
        //     return res.status(404).json({ error: "Shopping cart not found" });
        // }

        // // create the order
        // const orderItems = await Promise.all(shoppingCart.cart_items.map(async (cartItem) => {
        //     // Create the order item
        //     const newOrderItem = await prisma.orderItem.create({
        //         data: {
        //             quantity: cartItem.quantity,
        //             orderit_total: cartItem.cartit_total,
        //             order: {
        //                 connect: { order_id: newOrder.order_id },
        //             },
        //             food: {
        //                 connect: { fd_id: cartItem.cartit_food_id },
        //             },
        //         },
        //     });
        //     return newOrderItem;
        // }));
        // // update order total
        // const orderTotal = orderItems.reduce((acc, item) => acc + item.orderit_total, 0);
        // await prisma.order.update({
        //     where: { order_id: newOrder.order_id },
        //     data: { order_total: orderTotal + deli_charge },
        // });

        // // // Deactivate shopping cart
        // // await prisma.shoppingCart.update({
        // //     where: { cart_id: shoppingCart.cart_id },
        // //     data: { cart_active: false },
        // // });
        // console.log("newOrder", newOrder);
    } catch (error) {
        console.error("Error creating order:", error);
    }
}
