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