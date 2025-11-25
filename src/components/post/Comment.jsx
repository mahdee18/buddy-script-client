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

    // --- FIX STARTS HERE ---
    const handleAddReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        const contentToPost = replyContent; // Store content locally

        // 1. Create a temporary "Optimistic" reply
        // We use Date.now() as a temp ID so React can render it immediately
        const optimisticReply = {
            _id: Date.now().toString(), 
            content: contentToPost,
            author: user, // Use current user details so image/name show up
            createdAt: new Date().toISOString(),
            likes: [],
            replies: []
        };

        // 2. Update the UI IMMEDIATELY (Don't wait for API)
        const previousReplies = commentData.replies || [];
        onCommentUpdated({ 
            ...commentData, 
            replies: [...previousReplies, optimisticReply] 
        });

        // 3. Reset Input
        setReplyContent('');
        setIsReplying(false);

        try {
            // 4. Send to Server in background
            const apiResponse = await addReply(postId, commentData._id, contentToPost, token);
            
            // 5. Once server confirms, replace the temp reply with the real one (optional but recommended)
            // We attach 'user' again to ensure the author object is fully populated
            const finalReply = { ...apiResponse, author: user };
            
            // Replace the last reply (our temp one) with the real server one
            const updatedReplies = [...previousReplies, finalReply];
            onCommentUpdated({ ...commentData, replies: updatedReplies });

        } catch (error) {
            console.error("Failed to add reply:", error);
            // If it fails, revert the UI change
            onCommentUpdated({ ...commentData, replies: previousReplies });
            alert("Failed to post reply. Please try again.");
        }
    };
    // --- FIX ENDS HERE ---
    
    const handleReplyUpdated = (updatedReply) => {
        const updatedReplies = commentData.replies.map(r => r._id === updatedReply._id ? updatedReply : r);
        onCommentUpdated({ ...commentData, replies: updatedReplies });
    };

    if (!commentData?.author) {
        return null;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-start space-x-3">
                <img src={commentData.author.profilePicture || '/images/profile.png'} alt={commentData.author.firstName} className="object-cover w-10 h-10 rounded-full"/>
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
                    <img src={user?.profilePicture || '/images/profile.png'} alt="Your avatar" className="w-8 h-8 rounded-full" />
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