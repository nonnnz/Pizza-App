import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Credentials {
  us_fname: string;
  us_lname: string;
  us_gender: string;
  us_role: string;
  us_phone: string;
  us_birthdate: string;
  us_email: string;
  us_password: string;
  confirm_password: string;
}

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/users`);
    return response.data.reverse();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (user: Credentials) => {
  try {
    const response = await axios.post(`${apiUrl}/users`, user, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    return error.message;
  }
}

export const updateUser = async (id: string, user: Credentials) => {
  try {
    const response = await axios.put(`${apiUrl}/users/${id}`, user, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    return error.message;
  }
}

export const getUser = async (id: string) => {
  try {
    const response = await axios.get(`${apiUrl}/users/${id}`);
    // response.data.us_password = "";
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return error.message;
  }
}

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${apiUrl}/users/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    return error.message;
  }
}