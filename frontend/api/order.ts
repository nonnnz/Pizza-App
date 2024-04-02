import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const fetchOrders = async () => {
    try {
        const response = await axios.get(`${apiUrl}/orders`);

        // return response.data;
        const formattedOrders = response.data.map((order) => {
            const dateObjCreatedAt = new Date(order.created_at);
            const formattedCreatedAt = `${dateObjCreatedAt.getFullYear()}-${String(dateObjCreatedAt.getMonth() + 1).padStart(2, '0')}-${dateObjCreatedAt.getDate()} ${dateObjCreatedAt.getHours()}:${dateObjCreatedAt.getMinutes()}:${dateObjCreatedAt.getSeconds()}`;
            const dateObjUpdatedAt = new Date(order.updated_at);
            const formattedUpdatedAt = `${dateObjUpdatedAt.getFullYear()}-${String(dateObjUpdatedAt.getMonth() + 1).padStart(2, '0')}-${dateObjUpdatedAt.getDate()} ${dateObjUpdatedAt.getHours()}:${dateObjUpdatedAt.getMinutes()}:${dateObjUpdatedAt.getSeconds()}`;
            return {
              ...order,
              created_at: formattedCreatedAt,
              updated_at: formattedUpdatedAt,
            };
          });
          return formattedOrders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

interface Order {
    deli_charge: number;
    deli_address: string;
    pay_method: string;
}

export const createOrder = async (order: Order) => {
    try {
        const response = await axios.post(`${apiUrl}/orders`, order, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        return error.message;
    }
}

interface OrderStatus {
    order_status: string;
}

export const updateOrder = async (id: string, order: OrderStatus) => {
    try {
        const response = await axios.put(`${apiUrl}/orders/${id}`, order, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        return error.message;
    }
}

export const getOrder = async (id: string) => {
    try {
        const response = await axios.get(`${apiUrl}/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order:', error);
        return error.message;
    }
}

export const deleteOrder = async (id: string) => {
    try {
        await axios.delete(`${apiUrl}/orders/${id}`, {
            withCredentials: true,
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        return error.message;
    }
}