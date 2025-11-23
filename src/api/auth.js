import axiosInstance from './axiosInstance';

export const registerUser = async (userData) => {
  try {
    const { data } = await axiosInstance.post('/users/register', userData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    console.log("4. loginUser in api/auth.js called. Making Axios call now...");
    const { data } = await axiosInstance.post('/users/login', credentials);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getMe = async () => {
    try {
        const { data } = await axiosInstance.get('/users/me');
        return data;
    } catch (error) {
        throw error;
    }
};