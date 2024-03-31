import prisma from "../DB/db.config.js";

export const getAllFoods = async (req, res) => {
  try {
    const foods = await prisma.food.findMany({
    });
    res.status(200).json(foods);
  } catch (error) {
    console.error("Error fetching foods:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getFoodById = async (req, res) => {
    const foodId = parseInt(req.params.id);
    
    try {
        const food = await prisma.food.findUnique({
            where: { fd_id: foodId },
            include: {
                pizzadetails: true,
                cartitems: true,
            },
        });
    
        if (!food) {
        return res.status(404).json({ error: "Food not found" });
        }
    
        res.json(food);
    } catch (error) {
        console.error("Error fetching food by ID:", error);
        res.status(500).json({ message: error.message });
    }
};

export const createFood = async (req, res) => {
    const { size_name, crust_name, pz_id } = req.body;
    const { fd_price } = req.body;
    const pizza = await prisma.pizza.findUnique({
        where: { pz_id },
    });
    const fd_name = `${pizza.pz_name} - ${size_name} - ${crust_name}`;
    try {
        // Create the food with the provided details
        const newFood = await prisma.food.create({
            data: {
                fd_name,
                fd_price,
            },
        });

        // Create the pizza detail and associate it with the newly created food and the specified pizza
        const newPizzaDetail = await prisma.pizzaDetail.create({
            data: {
                size_name,
                crust_name,
                food: {
                    connect: { fd_id: newFood.fd_id }, // Connect to the newly created food
                },
                pizza: {
                    connect: { pz_id }, // Connect to the specified pizza
                },
            },
        });

        // Return the newly created food
        res.status(201).json(newFood);
    } catch (error) {
        console.error("Error creating food:", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateFood = async (req, res) => {
    const foodId = parseInt(req.params.id);
    const { size_name, crust_name, pz_id } = req.body;
    const { fd_price } = req.body;

    try {
        // Update the food with the provided details
        const updatedFood = await prisma.food.update({
            where: { fd_id: foodId }, // Specify the food ID to update
            data: {
                fd_price,
            },
        });

        // Update the associated pizza detail with the new size, crust name, and pz_id
        const updatedPizzaDetail = await prisma.pizzaDetail.update({
            where: { fd_id: foodId },
            data: {
                size_name,
                crust_name,
                pizza: {
                    connect: { pz_id }, // Connect to the specified pizza
                },
            },
        });

        // Return the updated food
        res.status(200).json(updatedFood);
    } catch (error) {
        console.error("Error updating food:", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteFood = async (req, res) => {
    const foodId = parseInt(req.params.id);
    
    try {
        // Find all PizzaDetails related to the food
        const pizzaDetails = await prisma.pizzaDetail.findMany({
            where: { fd_id: foodId },
        });

        // Delete each related PizzaDetail record
        await Promise.all(
            pizzaDetails.map(async (pizzaDetail) => {
                await prisma.pizzaDetail.delete({
                    where: { pd_id: pizzaDetail.pd_id },
                });
            })
        );
        // update cart total
        // Find all cart items related to the food
        const cartItems = await prisma.cartItem.findMany({
            where: { cartit_food_id: foodId },
            select: { cartit_total: true, cart_shoppingcart_id: true }, // Select only the required fields
        });

        // Update the cart total for each cart item
        await Promise.all(cartItems.map(async (item) => {
            await prisma.shoppingCart.update({
                where: { 
                    cart_id: item.cart_shoppingcart_id,
                    cart_active : true
                },
                data: {
                    cart_total: {
                        decrement: item.cartit_total,
                    },
                },
            });
        }));


        // Delete the Food record
        await prisma.food.delete({
            where: { fd_id: foodId },
        });
        res.status(200).json({ message: "Food deleted successfully" });
    } catch (error) {
        console.error("Error deleting food:", error);
        res.status(500).json({ message: error.message });
    }
};

// pizza controller
export const getAllPizzaWithDetailsAndFood = async (req, res) => {
    try {
        const pizzas = await prisma.pizza.findMany({
            include: {
              pizzadetails: {
                include: {
                  food: true,
                },
              },
            },
        });
        res.status(200).json(pizzas);
    } catch (error) {
      console.error('Error fetching pizza details:', error);
      throw error;
    }
};

export const getPizzaById = async (req, res) => {
    const pizzaId = parseInt(req.params.id);
    try {
        const pizza = await prisma.pizza.findUnique({
            where: { pz_id: pizzaId },
            include: {
                pizzadetails: {
                    include: {
                        food: true,
                    },
                },
            },
        });
        res.status(200).json(pizza);
    } catch (error) {
        console.error('Error fetching pizza details:', error);
        res.status(500).json({ message: error.message });
    }
};

export const createPizza = async (req, res) => {
    const { pz_name, pz_des, pz_qty, pz_image } = req.body;
    try {
        const newPizza = await prisma.pizza.create({
            data: {
                pz_name,
                pz_des,
                pz_qty,
                // pz_image,
            },
        });
        res.status(201).json(newPizza);
    } catch (error) {
        console.error('Error creating pizza:', error);
        res.status(500).json({ message: error.message });
    }
};

export const updatePizza = async (req, res) => {
    const pizzaId = parseInt(req.params.id);
    const { pz_name, pz_des, pz_qty, pz_image } = req.body;
    try {
        const updatedPizza = await prisma.pizza.update({
            where: { pz_id: pizzaId },
            data: {
                pz_name,
                pz_des,
                pz_qty,
                pz_image,
            },
        });
        res.status(200).json(updatedPizza);
    } catch (error) {
        console.error('Error updating pizza:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deletePizza = async (req, res) => {
    const pizzaId = parseInt(req.params.id);
    try {
        // Find all PizzaDetails related to the pizza
        const pizzaDetails = await prisma.pizzaDetail.findMany({
            where: { pz_id: pizzaId },
        });

        // Delete each related PizzaDetail record
        await Promise.all(
            pizzaDetails.map(async (pizzaDetail) => {
                // Delete the PizzaDetail record
                await prisma.pizzaDetail.delete({
                    where: { pd_id: pizzaDetail.pd_id },
                });

                // Delete the associated Food record
                await prisma.food.delete({
                    where: { fd_id: pizzaDetail.fd_id },
                });
            })
        );

        // Delete the pizza record
        await prisma.pizza.delete({
            where: { pz_id: pizzaId },
        });

        res.status(200).json({ message: 'Pizza and related PizzaDetails and Foods deleted successfully' });
    } catch (error) {
        console.error('Error deleting pizza:', error);
        res.status(500).json({ message: error.message });
    }
};
 
