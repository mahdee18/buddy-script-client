import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { likeReply } from '../../api/posts';

const Reply = ({ postId, commentId, replyData, onReplyUpdated, onLikersClick }) => {
    const { user, token } = useAuth();
    const isLikedByCurrentUser = replyData.likes.some(likeId => (likeId._id || likeId).toString() === user?._id);

    const handleReplyLikeToggle = async () => {
        if (!user) return;
        const newLikes = isLikedByCurrentUser ? replyData.likes.filter(id => (id._id || id).toString() !== user._id) : [...replyData.likes, user._id];
        onReplyUpdated({ ...replyData, likes: newLikes });
        try { await likeReply(postId, commentId, replyData._id, token); } 
        catch (error) { onReplyUpdated(replyData); }
    };

    return (
        <div className="flex items-start space-x-3 ml-12">
            <img src={replyData.author.profilePicture || '/images/profile.png'} alt={replyData.author.firstName} className="object-cover w-8 h-8 rounded-full"/>
            <div className="flex-1">
                <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-800">{replyData.author.firstName} {replyData.author.lastName}</p>
                    <p className="text-sm text-gray-700">{replyData.content}</p>
                </div>
                <div className="flex items-center gap-4 px-2 mt-1 text-xs text-gray-500">
                    <button onClick={handleReplyLikeToggle} className={`font-semibold ${isLikedByCurrentUser ? 'text-blue-600' : 'hover:underline'}`}>Like</button>
                    <button onClick={() => onLikersClick({ replyId: replyData._id })} className="hover:underline">{replyData.likes.length > 0 && `${replyData.likes.length} Likes`}</button>
                    <span>{formatDistanceToNow(new Date(replyData.createdAt), { addSuffix: true })}</span>
                </div>
            </div>
        </div>
    );
};

export default Reply;