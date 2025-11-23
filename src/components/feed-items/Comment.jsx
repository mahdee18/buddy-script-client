import React from 'react';

const Comment = ({ comment }) => {
    return (
        <div className="flex items-start mt-4 space-x-3">
            <img src={comment.author.avatar} alt={comment.author.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
                <div className="p-3 bg-gray-100 rounded-lg">
                    <h5 className="font-semibold text-gray-800">{comment.author.name}</h5>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
                <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500">
                    <button className="font-semibold hover:underline">Like</button>
                    <span>&middot;</span>
                    <button className="font-semibold hover:underline">Reply</button>
                    <span>&middot;</span>
                    <span>{comment.timestamp}</span>
                </div>
            </div>
        </div>
    );
};

export default Comment;