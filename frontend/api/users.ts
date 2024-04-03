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

interface AddressBook {
  addb_user_id: string;
  addb_buildingNo: string;
  addb_buildingName: string;
  addb_street: string;
  addb_prov: string;
  addb_dist: string;
  addb_subdist: string;
  addb_zipcode: string;
  addb_directionguide: string;
  addb_phone: string;
  addb_name: string;
}

export const getAddressBook = async (id: string) => {
  try {
    const response = await axios.get(`${apiUrl}/addressbooks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching address book:', error);
    return error.message;
  }
}

export const createAddressBook = async (address: AddressBook) => {
  try {
    const response = await axios.post(`${apiUrl}/addressbooks`, address, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating address book:', error);
    return error.message;
  }
}

export const updateAddressBook = async (id: string, address: AddressBook) => {
  try {
    const response = await axios.put(`${apiUrl}/addressbooks/${id}`, address, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating address book:', error);
    return error.message;
  }
}