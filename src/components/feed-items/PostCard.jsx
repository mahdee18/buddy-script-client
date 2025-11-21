
import React from 'react';
import Comment from './Comment'

const PostCard = ({ post }) => {
    return (
        <div className="p-4 mb-6 bg-white rounded-lg shadow md:p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full" />
                    <div>
                        <h4 className="font-bold text-gray-800">{post.author.name}</h4>
                        <p className="text-sm text-gray-500">{post.timestamp} &middot; Public</p>
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <p className="mb-4 text-gray-700">{post.content}</p>
                {post.imageUrl && <img src={post.imageUrl} alt="Post content" className="w-full rounded-lg" />}
            </div>
            <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                 <div className="flex items-center -space-x-2">
                    <img src="/src/assets/images/react_img1.png" className="w-6 h-6 border-2 border-white rounded-full" />
                    <img src="/src/assets/images/react_img2.png" className="w-6 h-6 border-2 border-white rounded-full" />
                    <span className="z-10 flex items-center justify-center w-6 h-6 text-xs font-semibold text-gray-600 bg-gray-200 border-2 border-white rounded-full">9+</span>
                </div>
                <div><span>{post.comments.length} Comments</span> &middot; <span>{post.shares} Shares</span></div>
            </div>
            <hr />
            <div className="flex justify-around py-1">
                <button className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-gray-600 rounded-lg hover:bg-gray-100">Haha</button>
                <button className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-gray-600 rounded-lg hover:bg-gray-100">Comment</button>
                <button className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-gray-600 rounded-lg hover:bg-gray-100">Share</button>
            </div>
            <hr />
            <div className="pt-4">
                {/* Render comments */}
                {post.comments.map(comment => <Comment key={comment.id} comment={comment} />)}
                {/* Comment Input */}
                <div className="flex items-start mt-4 space-x-3">
                    <img src="/src/assets/images/profile.png" alt="Your avatar" className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                        <textarea className="w-full p-2 text-sm bg-gray-100 border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-gray-300" rows="1" placeholder="Write a comment..."></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;