import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { likeComment, addReply } from '../../api/posts';
import Reply from './Reply';
import { FiSend } from 'react-icons/fi';

const Comment = ({ postId, commentData, onCommentUpdated, onLikersClick }) => {
    const { user, token } = useAuth();
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const isLikedByCurrentUser = commentData.likes.some(likeId => (likeId._id || likeId).toString() === user?._id);

    const handleCommentLikeToggle = async () => {
        if (!user) return;
        const newLikes = isLikedByCurrentUser ? commentData.likes.filter(id => (id._id || id).toString() !== user._id) : [...commentData.likes, user._id];
        onCommentUpdated({ ...commentData, likes: newLikes });
        try { await likeComment(postId, commentData._id, token); } 
        catch (error) { onCommentUpdated(commentData); }
    };

    const handleAddReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        try {
            const newReply = await addReply(postId, commentData._id, replyContent, token);
            onCommentUpdated({ ...commentData, replies: [...(commentData.replies || []), newReply] });
            setReplyContent('');
            setIsReplying(false);
        } catch (error) { console.error("Failed to add reply:", error); }
    };
    
    const handleReplyUpdated = (updatedReply) => {
        const updatedReplies = commentData.replies.map(r => r._id === updatedReply._id ? updatedReply : r);
        onCommentUpdated({ ...commentData, replies: updatedReplies });
    };

    return (
        <div className="space-y-3">
            <div className="flex items-start space-x-3">
                <img src={commentData.author.profilePicture || '/src/assets/images/profile.png'} alt={commentData.author.firstName} className="object-cover w-10 h-10 rounded-full"/>
                <div className="flex-1">
                    <div className="p-3 bg-gray-100 rounded-lg">
                        <p className="text-sm font-semibold text-gray-800">{commentData.author.firstName} {commentData.author.lastName}</p>
                        <p className="text-sm text-gray-700">{commentData.content}</p>
                    </div>
                    <div className="flex items-center gap-4 px-2 mt-1 text-xs text-gray-500">
                        <button onClick={handleCommentLikeToggle} className={`font-semibold ${isLikedByCurrentUser ? 'text-blue-600' : 'hover:underline'}`}>Like</button>
                        <button onClick={() => onLikersClick({ commentId: commentData._id })} className="hover:underline">{commentData.likes.length > 0 && `${commentData.likes.length} Likes`}</button>
                        <button onClick={() => setIsReplying(!isReplying)} className="font-semibold hover:underline">Reply</button>
                        <span>{formatDistanceToNow(new Date(commentData.createdAt), { addSuffix: true })}</span>
                    </div>
                </div>
            </div>
            {commentData.replies?.map(reply => <Reply key={reply._id} postId={postId} commentId={commentData._id} replyData={reply} onReplyUpdated={handleReplyUpdated} onLikersClick={(ids) => onLikersClick({ ...ids, commentId: commentData._id })} />)}
            {isReplying && (
                <form onSubmit={handleAddReply} className="flex items-center space-x-3 ml-12">
                    <img src={user?.profilePicture || '/src/assets/images/profile.png'} alt="Your avatar" className="w-8 h-8 rounded-full" />
                    <input type="text" value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="Write a reply..." className="w-full p-2 text-sm bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <button type="submit" disabled={!replyContent.trim()} className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-blue-300">
                        <FiSend size={16}/>
                    </button>
                </form>
            )}
        </div>
    );
};

export default Comment;