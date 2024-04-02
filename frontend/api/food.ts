import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Pizza {
    pz_name: string;
    pz_des: string;
    pz_image: string;
}

// pizza
export const fetchPizza = async () => {
    try {
        const response = await axios.get(`${apiUrl}/pizza`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pizza:', error);
        throw error;
    }
}

export const createPizza = async (pizza: Pizza) => {
    try {
        const response = await axios.post(`${apiUrl}/pizza`, pizza, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating pizza:', error);
        return error.message;
    }
}

export const updatePizza = async (id: string, pizza: Pizza) => {
    try {
        const response = await axios.put(`${apiUrl}/pizza/${id}`, pizza, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating pizza:', error);
        return error.message;
    }
}

export const getPizza = async (id: string) => {
    try {
        const response = await axios.get(`${apiUrl}/pizza/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pizza:', error);
        return error.message;
    }
}

export const deletePizza = async (id: string) => {
    try {
        const response = await axios.delete(`${apiUrl}/pizza/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting pizza:', error);
        return error.message;
    }
}

export const fetchFood = async () => {
    try {
        const response = await axios.get(`${apiUrl}/food`);
        return response.data;
    } catch (error) {
        console.error('Error fetching food:', error);
        throw error;
    }
}
