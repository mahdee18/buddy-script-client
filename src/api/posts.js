import axios from 'axios'; 

const API_URL = '/api/posts';

export const createPost = async (postData, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    
    // This line requires 'axios' to be imported
    const response = await axios.post(API_URL, postData, config);
    return response.data;
};