import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from './Avatar';
import { BsCardImage, BsCameraVideo, BsCalendar2Event, BsNewspaper } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';

/**
 * A non-interactive, visually accurate trigger component shown in the feed. */
const CreatePostTrigger = ({ onClick }) => {
    const { user } = useAuth();

    // Reusable icon button component for the actions row.
    const ActionButton = ({ icon, text, disabled = false }) => (
        <div className={`flex items-center gap-2 p-2 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
            {icon}
            <span className="font-medium text-sm">{text}</span>
        </div>
    );

    return (
        <div className="p-4 mb-6 bg-white rounded-lg shadow-md">
            {/* Top row: Avatar and input-like text */}
            <div className="flex items-center gap-3 border-b pb-4">
                <Avatar
                    src={user?.profilePicture}
                    alt={user?.name || 'Your avatar'}
                    className="w-10 h-10"
                />
                <button
                    onClick={onClick}
                    className="w-full text-left text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Create a new post"
                >
                    Write something...
                </button>
            </div>

            {/* Bottom row: Action buttons */}
            <div className="flex justify-between items-center pt-3">
                <div className="flex items-center">
                    <button
                        onClick={onClick}
                        className="flex items-center gap-2 p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Create a post with a photo"
                    >
                        <BsCardImage size={20} className="text-blue-500" />
                        <span className="font-medium text-sm">Photo</span>
                    </button>
                    
                    <ActionButton icon={<BsCameraVideo size={20} />} text="Video" disabled />
                    <ActionButton icon={<BsCalendar2Event size={20} />} text="Event" disabled />
                    <ActionButton icon={<BsNewspaper size={20} />} text="Article" disabled />
                </div>

                <button
                    onClick={onClick}
                    className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                    aria-label="Open post creation form"
                >
                    <FiSend size={16} />
                    <span>Post</span>
                </button>
            </div>
        </div>
    );
};

export default CreatePostTrigger;