import prisma from "../DB/db.config.js";

export const findUniqueOrderId = async () => {
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

export const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
        include: {
            order_items: true,
            // user: true,
        },
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    const orderId = parseInt(req.params.id);
    try {
        const order = await prisma.order.findUnique({
            where: { order_id: orderId },
            include: {
                order_items: true,
                // user: true,
            },
        });
        res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        res.status(500).json({ message: error.message });
    }
};

export const createOrder = async (req, res) => {
    const userId = req.session.userId;
    const { deli_charge, deli_address, pay_method } = req.body;

    try {
        const orderId = await findUniqueOrderId();
        // empty order
        const newOrder = await prisma.order.create({
            data: {
                order_id: orderId,
                user: { connect: { user_id: userId } },
                deli_charge: deli_charge,
                order_total: 0,
                deli_address: deli_address,
                pay_method: pay_method,
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

        // Deactivate shopping cart
        await prisma.shoppingCart.update({
            where: { cart_id: shoppingCart.cart_id },
            data: { cart_active: false },
        });

        res.status(201).json({ message: "Order created successfully", orderItems });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateOrder = async (req, res) => {
    const orderId = parseInt(req.params.id);
    const { order_status } = req.body;

    try {
        const updatedOrder = await prisma.order.update({
            where: { order_id: orderId },
            data: {
                order_status: order_status,
            },
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    const orderId = parseInt(req.params.id);

    try {
        // Find and delete all related order items
        await prisma.orderItem.deleteMany({
            where: { orderit_order_id: orderId },
        });

        await prisma.order.delete({
            where: { order_id: orderId },
        });
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: error.message });
    }
};