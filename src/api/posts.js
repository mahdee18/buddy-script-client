import axios from 'axios';

const API_URL = '/api/posts';

export const createPost = async (postData, token) => {
    const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, postData, config);
    return response.data;
};

export const getAllPosts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const deletePost = async (postId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}/${postId}`, config);
    return response.data;
};

export const likePost = async (postId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/${postId}/like`, null, config);
    return response.data;
};

export const addComment = async (postId, content, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/${postId}/comments`, { content }, config);
    return response.data;
};

export const likeComment = async (postId, commentId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/${postId}/comments/${commentId}/like`, null, config);
    return response.data;
};

export const addReply = async (postId, commentId, content, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/${postId}/comments/${commentId}/reply`, { content }, config);
    return response.data;
};

export const likeReply = async (postId, commentId, replyId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}/${postId}/comments/${commentId}/replies/${replyId}/like`, null, config);
    return response.data;
};

export const getLikers = async (postId, { commentId, replyId }, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` }, params: { commentId, replyId } };
    const response = await axios.get(`${API_URL}/${postId}/likers`, config);
    return response.data;
};