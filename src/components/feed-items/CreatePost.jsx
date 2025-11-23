import React from 'react';

const CreatePost = () => {
    return (
        <div className="p-6 mb-6 bg-white rounded-lg shadow">
            <div className="flex items-start space-x-4">
                <img src="/src/assets/images/profile.png" alt="Your avatar" className="w-12 h-12 rounded-full" />
                <textarea
                    className="w-full p-3 text-gray-500 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-gray-300"
                    rows="2"
                    placeholder="Write something..."
                ></textarea>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-4 text-gray-500">
                    <button className="flex items-center gap-2 transition hover:text-blue-600">Photo</button>
                    <button className="flex items-center gap-2 transition hover:text-blue-600">Video</button>
                    <button className="flex items-center gap-2 transition hover:text-blue-600">Event</button>
                </div>
                <button className="px-6 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Post
                </button>
            </div>
        </div>
    );
};

export default CreatePost;