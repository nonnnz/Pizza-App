import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const getCart = async () => {
  try {
    const response = await axios.get(`${apiUrl}/shopping-carts/cart-items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

export const getShoppingCart = async () => {
  try {
    const response = await axios.get(`${apiUrl}/shopping-carts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return error.message;
  }
}

export const createShoppingCart = async () => {
  try {
    const response = await axios.post(`${apiUrl}/shopping-carts`);
    return response.data;
  } catch (error) {
    console.error('Error creating cart:', error);
    return error.message;
  }
}

interface CartItem {
  cartit_food_id: number;
  quantity: number;
}

export const addToCart = async (item: CartItem) => {
  try {
    console.log('Adding to cart2:', item);
    const response = await axios.post(`${apiUrl}/shopping-carts/cart-items`, item);
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return error;
  }
}

export const updateCartItem = async (id: string, item: CartItem) => {
  try {
    const response = await axios.put(`${apiUrl}/shopping-carts/cart-items/${id}`, item);
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    return error.message;
  }
}

export const deleteCartItem = async (id: string) => {
  try {
    const response = await axios.delete(`${apiUrl}/shopping-carts/cart-items/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return error.message;
  }
}