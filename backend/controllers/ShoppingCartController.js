import prisma from "../DB/db.config.js";

// func
export const getActiveCartId = async (userId) => {
    const existingShoppingCart = await prisma.shoppingCart.findFirst({
        where: { cart_user_id: userId, cart_active: true },
    });

    if (!existingShoppingCart) {
        throw new Error("Active cart not found for the user");
    }
    // console.log("error here");

    return existingShoppingCart.cart_id;
};

export const getAllShoppingCarts = async (req, res) => {
    try {
        const shoppingCarts = await prisma.shoppingCart.findMany({
            include: {
                cart_items: true,
            },
        });
        res.status(200).json(shoppingCarts);
    } catch (error) {
        console.error("Error fetching shoppingCarts:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getShoppingCartById = async (req, res) => {
    // const cartId = parseInt(req.params.id);
    const userId = req.session.userId;
    try {
        const cartId = await getActiveCartId(userId);
        // Check if the shopping cart belongs to the authenticated user
        const shoppingCart = await prisma.shoppingCart.findUnique({
            where: { cart_id: cartId },
            include: {
                cart_items: true,
            },
        });

        if (!shoppingCart || shoppingCart.user_id !== userId) {
            // If the shopping cart does not exist or does not belong to the user, return an unauthorized response
            return res.status(403).json({ message: "Unauthorized to access this shopping cart" });
        }

        res.status(200).json(shoppingCart);
    } catch (error) {
        console.error("Error fetching shoppingCart by ID:", error);
        res.status(500).json({ message: error.message });
    }
};

export const createShoppingCart = async (req, res) => {
    const userId = req.session.userId;

    try {
        const existingShoppingCart = await prisma.shoppingCart.findFirst({
            where: { cart_user_id: userId, cart_active: true },
        });
        if (existingShoppingCart) {
            // If an active shopping cart already exists for the user, return a conflict response
            return res.status(409).json({ message: "An active shopping cart already exists for this user" });
        }
        const newShoppingCart = await prisma.shoppingCart.create({
            data: {
                cart_user_id: userId,
                cart_active: true,
                cart_total: 0.0, // Initialize cart_total to 0.0 by default
            },
        });

        res.status(201).json(newShoppingCart);
    } catch (error) {
        console.error("Error creating shoppingCart:", error);
        res.status(500).json({ message: error.message });
    }
}


export const updateShoppingCart = async (req, res) => {
    const cartId = parseInt(req.params.id);
    const { cart_total, cart_active } = req.body;
    const userId = req.session.userId;


    try {
        // Check if the shopping cart belongs to the authenticated user
        const existingShoppingCart = await prisma.shoppingCart.findUnique({
            where: { 
                cart_id: cartId,
                cart_active: true,
            },
            select: { cart_user_id: true },
        });

        if (!existingShoppingCart || existingShoppingCart.cart_user_id !== userId) {
            // If the shopping cart does not exist or does not belong to the user, return an unauthorized response
            return res.status(403).json({ message: "Unauthorized to update this shopping cart" });
        }

        const updatedShoppingCart = await prisma.shoppingCart.update({
            where: { cart_id: cartId },
            data: {
                cart_total,
                cart_active
            },
        });

        res.status(200).json(updatedShoppingCart);
    } catch (error) {
        console.error("Error updating shoppingCart:", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteShoppingCart = async (req, res) => {
    const cartId = parseInt(req.params.id);
    const userId = req.session.userId;

    try {
        // Check if the shopping cart belongs to the authenticated user
        const existingShoppingCart = await prisma.shoppingCart.findUnique({
            where: { cart_id: cartId },
            select: { cart_user_id: true },
        });

        // console.log(existingShoppingCart);

        if (!existingShoppingCart || existingShoppingCart.cart_user_id !== userId) {
            // If the shopping cart does not exist or does not belong to the user, return an unauthorized response
            return res.status(403).json({ message: "Unauthorized to delete this shopping cart" });
        }

        const deletedShoppingCart = await prisma.shoppingCart.delete({
            where: { cart_id: cartId },
        });

        res.status(200).json(deletedShoppingCart);
    } catch (error) {
        console.error("Error deleting shoppingCart:", error);
        res.status(500).json({ message: error.message });
    }
};


// cart items
export const getCartItemsByCartId = async (req, res) => {
    // const cartId = parseInt(req.params.id);
    const userId = req.session.userId; 
    try {
        const cartId = await getActiveCartId(userId);

        const cartItems = await prisma.cartItem.findMany({
            where: { cart_shoppingcart_id: cartId },
            include: {
                food: true,
            },
        });
        res.status(200).json(cartItems);
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ message: error.message });
    }
};

export const createCartItem = async (req, res) => {
    // const cartId = parseInt(req.params.id);
    const userId = req.session.userId; 
    const { cartit_food_id, quantity } = req.body;
    try {
        // Check if there is an active cart for the user
        const existingShoppingCart = await prisma.shoppingCart.findFirst({
            where: { cart_user_id: userId, cart_active: true },
        });

        if (!existingShoppingCart) {
            return res.status(404).json({ message: "Active cart not found for the user" });
        }

        const cartId = existingShoppingCart.cart_id;

        // Check if the cart item already exists
        const existingCartItem = await isCartItemExistInCart(cartId, cartit_food_id);

        if (existingCartItem) {
            return res.status(409).json({ message: "Cart item already exists" });
        }

        const findFood = await prisma.food.findUnique({
            where: { fd_id: cartit_food_id },
        });
        const foodPrice = findFood.fd_price;
        const cartit_total = foodPrice * quantity;
        const newCartItem = await prisma.cartItem.create({
            data: {
                cart_shoppingcart_id: cartId,
                cartit_food_id,
                quantity,
                cartit_total,
            },
        });
        const updatedCartTotal = await prisma.shoppingCart.update({
            where: { cart_id: cartId },
            data: {
                cart_total: {
                    increment: cartit_total
                }
            }
        });
        res.status(201).json(newCartItem);
    } catch (error) {
        console.error("Error creating cart item:", error);
        res.status(500).json({ message: error.message });
    }
};

// Function to check if a cart item exists in the shopping cart
async function isCartItemExistInCart(cartId, cartit_food_id) {
    try {
        // Check if the shopping cart exists
        const existingShoppingCart = await prisma.shoppingCart.findUnique({
            where: { cart_id: cartId },
            include: { cart_items: true },
        });

        if (!existingShoppingCart) {
            return false; // Shopping cart not found
        }

        // Check if the cart item exists within the shopping cart
        const existingCartItem = existingShoppingCart.cart_items.find(item => item.cartit_food_id === cartit_food_id);
        
        return !!existingCartItem; // Return true if the cart item exists, false otherwise
    } catch (error) {
        console.error("Error checking if cart item exists in cart:", error);
        return false;
    }
}

export const isCartItemExist = async (req, res) => {
    const cartId = parseInt(req.params.id);
    const { cartit_food_id } = req.body;
    
    try {
        // Check if the shopping cart exists
        const existingShoppingCart = await prisma.shoppingCart.findUnique({
            where: { cart_id: cartId },
            include: { cart_items: true }, // Include the cart items associated with the shopping cart
        });

        if (!existingShoppingCart) {
            return res.status(404).json({ message: "Shopping cart not found" });
        }

        // Check if the cart item exists within the shopping cart
        const existingCartItem = existingShoppingCart.cart_items.find(item => item.cartit_food_id === cartit_food_id);
        
        if (existingCartItem) {
            return res.status(200).json({ message: "Cart item exists" });
        }

        res.status(404).json({ message: "Cart item not found" });
    } catch (error) {
        console.error("Error checking if cart item exists:", error);
        res.status(500).json({ message: error.message });
    }
};



export const updateCartItem = async (req, res) => {
    // const cartId = parseInt(req.params.cartId);
    const itemId = parseInt(req.params.itemId);
    const userId = req.session.userId; 
    const { cartit_food_id, quantity } = req.body;
    console.log(itemId, cartit_food_id, quantity);
    
    try {
        // Check if there is an active cart for the user
        const existingShoppingCart = await prisma.shoppingCart.findFirst({
            where: { cart_user_id: userId, cart_active: true },
        });

        if (!existingShoppingCart) {
            return res.status(404).json({ message: "Active cart not found for the user" });
        }

        const cartId = existingShoppingCart.cart_id;

        // Check if the cart item exists
        const existingCartItem = await prisma.cartItem.findUnique({
            where: { 
                cart_itemid: itemId,
                cart_shoppingcart_id: cartId,
                cartit_food_id,
            },
        });

        if (!existingCartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        // Check if the quantity is less than or equal to 0
        if (quantity <= 0) {
            // Delete the cart item
            const deletedCartItem = await prisma.cartItem.delete({
                where: { cart_itemid: itemId, cart_shoppingcart_id: cartId }, // Filter by both cartId and itemId
            });

            // Update the cart total by decrementing the deletedCartItem's cartit_total
            const updatedCartTotal = await prisma.shoppingCart.update({
                where: { cart_id: cartId },
                data: {
                    cart_total: {
                        decrement: deletedCartItem.cartit_total
                    }
                }
            });

            return res.status(200).json(deletedCartItem);
        }
        if (quantity > 99) {
            return res.status(400).json({ message: 'Quantity cannot exceed 99' });
        }

        const oldCartItem = await prisma.cartItem.findUnique({
            where: { 
                cart_itemid: itemId,
                cart_shoppingcart_id: cartId,
                cartit_food_id: cartit_food_id,
            },
                include: { food: true },
        });

        const updatedCartItemTotal = oldCartItem.food.fd_price * quantity;

        const updatedCartItem = await prisma.cartItem.update({
            where: { 
                cart_itemid: itemId,
                cart_shoppingcart_id: cartId,
                cartit_food_id: cartit_food_id,
            }, // Filter by both cartId and itemId
            data: {
                quantity,
                cartit_total: updatedCartItemTotal,
            },
        });

        // Retrieve the shopping cart including its cart items and their cartit_total values
        const shoppingCartWithItems = await prisma.shoppingCart.findUnique({
            where: { cart_id: cartId },
            include: {
                cart_items: {
                    select: { cartit_total: true }
                }
            }
        });

        // Calculate the new cart total by summing up the cartit_total values of all cart items
        const newCartTotal = shoppingCartWithItems.cart_items.reduce((total, item) => total + item.cartit_total, 0);

        // Update the shopping cart with the new cart total
        const updatedCartTotal = await prisma.shoppingCart.update({
            where: { cart_id: cartId },
            data: {
                cart_total: newCartTotal
            }
        });
        
        res.status(200).json(updatedCartItem);
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ message: error.message });
    }
};


export const deleteCartItem = async (req, res) => {
    // const cartId = parseInt(req.params.cartId);
    const itemId = parseInt(req.params.itemId);
    const userId = req.session.userId; 
    
    try {
        const cartId = await getActiveCartId(userId);

        const deletedCartItem = await prisma.cartItem.delete({
            where: { cart_itemid: itemId, cart_shoppingcart_id: cartId }, // Filter by both cartId and itemId
        });

        const updatedCartTotal = await prisma.shoppingCart.update({
            where: { cart_id: cartId },
            data: {
                cart_total: {
                    decrement: deletedCartItem.cartit_total
                }
            }
        });
        res.status(200).json(deletedCartItem);
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ message: error.message });
    }
};
