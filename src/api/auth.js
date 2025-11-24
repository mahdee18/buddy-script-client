import axiosInstance from './axiosInstance';

// A single, reusable function for handling API requests.
const apiRequest = async (method, url, payload = null) => {
  try {
    const { data } = await axiosInstance[method](url, payload);
    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(errorMessage);
  }
};

/**
 * Registers a new user. */
export const registerUser = (userData) => apiRequest('post', '/users/register', userData);

export const loginUser = (credentials) => apiRequest('post', '/users/login', credentials);

export const getMe = () => apiRequest('get', '/users/me');