import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createPost } from '../../api/posts';
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import { BsCardImage, BsCameraVideo, BsCalendar2Event, BsNewspaper } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const CreatePostModalForm = ({ onPostCreated, onClose }) => {
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
        setLoading(true);
        setError('');
        try {
            let hostedImageUrl = '';
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData);
                if (response.data.success) {
                    hostedImageUrl = response.data.data.url;
                } else {
                    throw new Error('Image upload failed.');
                }
            }
            const postData = { content, imageUrl: hostedImageUrl };
            const newPost = await createPost(postData, token);
            if (onPostCreated) {
                onPostCreated(newPost);
            }
        } catch (err) {
            const serverErrorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
            setError(`Failed to create post. ${serverErrorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const ActionButton = ({ icon, text, onClick, isFunctional = false }) => (
        <button 
            type="button" 
            onClick={onClick} 
            disabled={!isFunctional}
            className={`flex items-center gap-2 px-2 py-1 rounded-md transition text-gray-600 ${isFunctional ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
            title={!isFunctional ? 'Feature not available' : ''}
        >
            {icon}
            <span className="font-semibold text-sm">{text}</span>
        </button>
    );

    return (
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-bold text-gray-800">Create Post</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">
                     <IoClose className="h-6 w-6 text-gray-600" />
                </button>
            </div>
            
            <div className="p-4">
                <div className="flex items-start space-x-3">
                    <img src={user?.profilePicture || "/src/assets/images/profile.png"} alt="Your avatar" className="w-12 h-12 rounded-full object-cover" />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 text-gray-700 bg-transparent rounded-lg focus:outline-none text-base resize-y"
                        rows="5"
                        placeholder={`Write something...`}
                    />
                </div>
                
                {imagePreview && (
                    <div className="relative mt-4 border rounded-lg p-2">
                        <img src={imagePreview} alt="Post preview" className="w-full rounded-lg max-h-72 object-contain" />
                        <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-70" aria-label="Remove image">
                           <IoClose className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            </div>

            <div className="flex items-center justify-between p-4 border-t">
                <div className="flex items-center space-x-2">
                    <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} className="hidden" />
                    <ActionButton icon={<BsCardImage size={20} className="text-green-500"/>} text="Photo" onClick={() => imageInputRef.current.click()} isFunctional={true} />
                    <ActionButton icon={<BsCameraVideo size={20} className="text-red-500"/>} text="Video" />
                    <ActionButton icon={<BsCalendar2Event size={20} className="text-orange-500"/>} text="Event" />
                    <ActionButton icon={<BsNewspaper size={20} className="text-purple-500"/>} text="Article" />
                </div>

                <button onClick={handleSubmit} disabled={loading || (!content && !imageFile)} className="flex items-center gap-2 px-5 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors">
                    <FiSend size={16} />
                    {loading ? <ClipLoader color="#ffffff" size={20} /> : 'Post'}
                </button>
            </div>
        </div>
    );
};

const CreatePost = ({ onPostCreated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();

    const handlePostCreation = (newPost) => {
        if (onPostCreated) {
            onPostCreated(newPost);
        }
        setIsOpen(false);
    };

    return (
        <>
            {/* This is the trigger that is always visible on the feed */}
            <div className="p-4 mb-6 bg-white rounded-lg shadow">
                <div className="flex items-center space-x-3">
                    <img src={user?.profilePicture || "/src/assets/images/profile.png"} alt="Your avatar" className="w-12 h-12 rounded-full object-cover" />
                    <button onClick={() => setIsOpen(true)} className="w-full p-3 text-left text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                        Write something...
                    </button>
                </div>
            </div>

            {/* This is the modal that opens when the trigger is clicked */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 bg-opacity-50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <div onClick={e => e.stopPropagation()}>
                        <CreatePostModalForm onPostCreated={handlePostCreation} onClose={() => setIsOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
};

export default CreatePost;