import axios, { AxiosError } from 'axios';
import { useToast } from "@/components/ui/use-toast";

interface Credentials {
  us_email: string;
  us_password: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const login = async (credentials: Credentials) => {
    try {
        console.log('Sending request with credentials:', credentials);

        const response = await axios.post(`${apiUrl}/login`, credentials, {
            withCredentials: true,
          });
          
    
        console.log('Server response:', response.data);
      return response.data;
    } catch (error) {
        console.log('Error:', error);
        // handleAxiosError(error as AxiosError); // Explicitly specify the type
        return error; // Re-throw the error after handling
    }
  };

export const fetchMe = async () => {
  try {
    const response = await axios.get(`${apiUrl}/me`);
    return response;
  } catch (error) {
    // handleAxiosError(error);
  }
};

export const logout = async () => {
  try {
    const response = await axios.delete(`${apiUrl}/logout`);
    return response.data;
  } catch (error) {
    // handleAxiosError(error);
  }
};

const handleAxiosError = (error: AxiosError) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error('Response data:', error.response.data);
    console.error('Status code:', error.response.status);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error message:', error.message);
  }
  throw error;
};
