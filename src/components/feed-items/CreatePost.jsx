import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createPost } from '../../api/posts';
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
    const { user, token } = useAuth();
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const imageInputRef = useRef(null);
    
    const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        if (imageInputRef.current) {
            imageInputRef.current.value = null;
        }
    };

    const handleSubmit = async () => {
        if (!content && !imageFile) {
            setError('Please write something or upload an image.');
            return;
        }
        if (!imgbbApiKey) {
            setError('ImgBB API Key is not configured. Please check your .env file.');
            return;
        }
        if (!token) {
            setError('You must be logged in to post.');
            return;
        }

        setLoading(true);
        setError('');
        let hostedImageUrl = '';

        try {
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData);
                if (response.data.success) {
                    hostedImageUrl = response.data.data.url;
                } else {
                    throw new Error('Image upload to hosting service failed.');
                }
            }

            const postData = { content, imageUrl: hostedImageUrl };
            const newPost = await createPost(postData, token);

            setContent('');
            handleRemoveImage();
            if (onPostCreated) {
                onPostCreated(newPost);
            }

        } catch (err) {
            console.error(err);
            const serverErrorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
            setError(`Failed to create post. ${serverErrorMessage}`);
        } finally {
            // This is the critical fix: always stop loading
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 mb-6 bg-white rounded-lg shadow">
            <div className="flex items-start space-x-4">
                <img src={user?.profilePicture || "/src/assets/images/profile.png"} alt="Your avatar" className="w-12 h-12 rounded-full object-cover" />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3 text-gray-700 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-blue-500"
                    rows="2"
                    placeholder={`What's on your mind, ${user?.firstName || ''}?`}
                ></textarea>
            </div>
            
            {imagePreview && (
                <div className="relative mt-4">
                    <img src={imagePreview} alt="Post preview" className="w-full rounded-lg max-h-96 object-contain bg-gray-100" />
                    <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-gray-800 bg-opacity-60 text-white rounded-full p-1.5 hover:bg-opacity-80 transition-colors" aria-label="Remove image">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}

            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

            <hr className="my-4" />

            <div className="flex flex-col sm:flex-row items-center justify-between mt-2">
                <div className="flex space-x-4 text-gray-600">
                    <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} className="hidden" />
                    <button onClick={() => imageInputRef.current.click()} className="flex items-center gap-2 transition hover:text-blue-600">📷 Photo</button>
                </div>
                <button onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto mt-4 sm:mt-0 px-6 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors">
                    {loading ? <ClipLoader color="#ffffff" size={20} /> : 'Post'}
                </button>
            </div>
        </div>
    );
};

export default CreatePost;