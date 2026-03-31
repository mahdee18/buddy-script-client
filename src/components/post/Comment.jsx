import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { likeComment, addReply } from '../../api/posts';
import Reply from './Reply';
import { FiSend } from 'react-icons/fi';

const Comment = ({ postId, commentData, onCommentUpdated, onLikersClick }) => {
    const { user } = useAuth();
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const isLikedByCurrentUser = commentData?.likes?.some(
        likeId => (likeId._id || likeId).toString() === user?._id
    );

    // ─── Like a comment (optimistic) ──────────────────────────────────────────
    const handleCommentLikeToggle = async () => {
        if (!user) return;

        const originalLikes = commentData.likes || [];
        const newLikes = isLikedByCurrentUser
            ? originalLikes.filter(id => (id._id || id).toString() !== user._id)
            : [...originalLikes, user._id];

        // Update UI immediately
        onCommentUpdated({ ...commentData, likes: newLikes });

        try {
            await likeComment(postId, commentData._id);
        } catch (error) {
            // Revert on failure
            onCommentUpdated({ ...commentData, likes: originalLikes });
        }
    };

    // ─── Add a reply (optimistic) ─────────────────────────────────────────────
    const handleAddReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim() || !user) return;

        const content = replyContent;
        const tempId = `temp-${Date.now()}`;
        const currentReplies = commentData.replies || [];

        // 1. Build the perfect UI reply
        const optimisticReply = {
            _id: tempId,
            content,
            author: user,
            createdAt: new Date().toISOString(),
            likes: [],
        };

        // 2. Show reply immediately on the screen
        const optimisticCommentState = {
            ...commentData,
            replies: [...currentReplies, optimisticReply],
        };
        onCommentUpdated(optimisticCommentState);

        setReplyContent('');
        setIsReplying(false);

        try {
            const response = await addReply(postId, commentData._id, content);
            const data = response?.data || response;

            let updatedReplies = [...optimisticCommentState.replies];

            // 3. Safely figure out what the backend returned
            
            // Scenario A: Backend returns the entire Post object
            if (data && data.comments) {
                const serverComment = data.comments.find(c => c._id === commentData._id);
                if (serverComment && serverComment.replies) {
                    const lastServerReply = serverComment.replies[serverComment.replies.length - 1];
                    const realReplyId = typeof lastServerReply === 'object' ? lastServerReply._id : lastServerReply;
                    if (realReplyId) {
                        updatedReplies = updatedReplies.map(r => 
                            r._id === tempId ? { ...r, _id: realReplyId } : r
                        );
                    }
                }
            }
            // Scenario B: Backend returns the entire updated Comment object
            else if (data && data.replies) {
                const lastServerReply = data.replies[data.replies.length - 1];
                const realReplyId = typeof lastServerReply === 'object' ? lastServerReply._id : lastServerReply;
                if (realReplyId) {
                    updatedReplies = updatedReplies.map(r => 
                        r._id === tempId ? { ...r, _id: realReplyId } : r
                    );
                }
            }
            // Scenario C: Backend returns just the newly created reply object
            else if (data && data._id) {
                updatedReplies = updatedReplies.map(r => 
                    r._id === tempId ? { ...data, author: user, likes: [] } : r
                );
            }

            // 4. Give the final fixed array back to PostCard
            onCommentUpdated({
                ...commentData,
                replies: updatedReplies
            });

        } catch (error) {
            console.error('Failed to add reply:', error);
            // Revert on failure
            onCommentUpdated({ ...commentData, replies: currentReplies });
            alert('Failed to post reply. Please try again.');
        }
    };

    // ─── Reply was liked inside Reply component ───────────────────────────────
    const handleReplyUpdated = (updatedReply) => {
        const updatedReplies = (commentData.replies || []).map(r =>
            r._id === updatedReply._id ? updatedReply : r
        );
        onCommentUpdated({ ...commentData, replies: updatedReplies });
    };

    if (!commentData?.author) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-start space-x-3">
                <img
                    src={commentData.author.profilePicture || '/images/profile.png'}
                    alt={commentData.author.firstName || 'User'}
                    className="object-cover w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                    <div className="p-3 bg-gray-100 rounded-lg">
                        <p className="text-sm font-semibold text-gray-800">
                            {commentData.author.firstName} {commentData.author.lastName}
                        </p>
                        <p className="text-sm text-gray-700">{commentData.content}</p>
                    </div>
                    <div className="flex items-center gap-4 px-2 mt-1 text-xs text-gray-500">
                        <button
                            onClick={handleCommentLikeToggle}
                            className={`font-semibold ${isLikedByCurrentUser ? 'text-blue-600' : 'hover:underline'}`}
                        >
                            Like
                        </button>
                        <button
                            onClick={() => onLikersClick({ commentId: commentData._id })}
                            className="hover:underline"
                        >
                            {commentData.likes?.length > 0 && `${commentData.likes.length} Likes`}
                        </button>
                        <button
                            onClick={() => setIsReplying(prev => !prev)}
                            className="font-semibold hover:underline"
                        >
                            Reply
                        </button>
                        <span>{formatDistanceToNow(new Date(commentData.createdAt), { addSuffix: true })}</span>
                    </div>
                </div>
            </div>

            {/* ── Replies list ── */}
            {commentData.replies?.map(reply => (
                <Reply
                    key={reply._id}
                    postId={postId}
                    commentId={commentData._id}
                    replyData={reply}
                    onReplyUpdated={handleReplyUpdated}
                    onLikersClick={ids => onLikersClick({ ...ids, commentId: commentData._id })}
                />
            ))}

            {/* ── Reply input ── */}
            {isReplying && (
                <form onSubmit={handleAddReply} className="flex items-center space-x-3 ml-12">
                    <img
                        src={user?.profilePicture || '/images/profile.png'}
                        alt="Your avatar"
                        className="w-8 h-8 rounded-full"
                    />
                    <input
                        type="text"
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full p-2 text-sm bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!replyContent.trim()}
                        className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        <FiSend size={16} />
                    </button>
                </form>
            )}
        </div>
    );
};

export default Comment;