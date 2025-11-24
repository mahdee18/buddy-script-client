import axios from 'axios';

const API_URL = '/api/posts';

// --- CREATE A NEW POST ---
export const createPost = async (postData, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, postData, config);
    return response.data;
};

// --- GET ALL POSTS (WITH POPULATED DATA) ---
export const getAllPosts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        throw error.response?.data?.message || 'Server error while fetching posts.';
    }
};

// --- LIKE OR UNLIKE A POST ---
export const likePost = async (postId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    // The second argument is `null` because a PUT request can have a body, but we don't need one here.
    const response = await axios.put(`${API_URL}/${postId}/like`, null, config);
    return response.data;
};

// --- ADD A COMMENT TO A POST ---
export const addComment = async (postId, content, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/${postId}/comments`, { content }, config);
    return response.data; // Returns the newly created comment object from the server
};

// --- LIKE OR UNLIKE A COMMENT ---
export const likeComment = async (postId, commentId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/${postId}/comments/${commentId}/like`, null, config);
    return response.data;
};