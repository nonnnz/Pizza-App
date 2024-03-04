import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/users`);
    return response.data.reverse();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Add more API functions as needed
