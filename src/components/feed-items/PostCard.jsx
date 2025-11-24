import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { likePost, addComment, likeComment } from '../../api/posts';

const Comment = ({ postId, commentData }) => {
    const { user, token } = useAuth();
    const [comment, setComment] = useState(commentData);

    useEffect(() => {
        setComment(commentData);
    }, [commentData]);

    if (!comment.author) {
        return null;
    }
    
    const isLikedByCurrentUser = comment.likes.some(likeId => likeId.equals ? likeId.equals(user._id) : likeId === user._id);

    const handleCommentLikeToggle = async () => {
        if (!user) return;
        
        const originalLikes = comment.likes;
        const newLikes = isLikedByCurrentUser
            ? originalLikes.filter(id => !(id.equals ? id.equals(user._id) : id === user._id))
            : [...originalLikes, user._id];
        
        setComment(prev => ({ ...prev, likes: newLikes }));

        try {
            await likeComment(postId, comment._id, token);
        } catch (error) {
            console.error("Failed to like comment:", error);
            setComment(prev => ({ ...prev, likes: originalLikes }));
        }
    };

    return (
        <div className="flex items-start space-x-3">
            <img src={comment.author.profilePicture || '/src/assets/images/profile.png'} alt={comment.author.firstName} className="object-cover w-10 h-10 rounded-full"/>
            <div className="flex-1">
                <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm font-semibold text-gray-800">{comment.author.firstName} {comment.author.lastName}</p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 px-2 mt-1 text-xs text-gray-500">
                    <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                    <button onClick={handleCommentLikeToggle} className={`font-semibold ${isLikedByCurrentUser ? 'text-blue-600' : 'hover:underline'}`}>
                        Like
                    </button>
                    <span>{comment.likes.length > 0 && `${comment.likes.length} Likes`}</span>
                </div>
            </div>
        </div>
    );
};

const PostCard = ({ post }) => {
    const { user, token } = useAuth();
    const [currentPost, setCurrentPost] = useState(post);
    const [commentContent, setCommentContent] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    useEffect(() => {
        setCurrentPost(post);
    }, [post]);
    
    const isLikedByCurrentUser = currentPost.likes.some(likeId => likeId.equals ? likeId.equals(user._id) : likeId === user._id);

    const handlePostLikeToggle = async () => {
        if (!user) return;
        
        const originalLikes = currentPost.likes;
        const newLikes = isLikedByCurrentUser
            ? originalLikes.filter(id => !(id.equals ? id.equals(user._id) : id === user._id))
            : [...originalLikes, user._id];
        
        setCurrentPost(prev => ({ ...prev, likes: newLikes }));

        try {
            await likePost(currentPost._id, token);
        } catch (error) {
            console.error("Failed to update like status:", error);
            setCurrentPost(prev => ({ ...prev, likes: originalLikes }));
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent.trim() || !user) return;
        
        setIsSubmittingComment(true);
        try {
            const newComment = await addComment(currentPost._id, commentContent, token);
            setCurrentPost(prev => ({ ...prev, comments: [newComment, ...prev.comments] }));
            setCommentContent('');
        } catch (error) {
            console.error("Failed to add comment:", error);
        } finally {
            setIsSubmittingComment(false);
        }
    };
    
    if (!currentPost || !currentPost.author) {
        return null;
    }

    return (
        <div className="p-4 mb-6 bg-white rounded-lg shadow md:p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <img src={currentPost.author.profilePicture || '/src/assets/images/profile.png'} alt={currentPost.author.firstName} className="object-cover w-12 h-12 rounded-full" />
                    <div>
                        <h4 className="font-bold text-gray-800">{currentPost.author.firstName} {currentPost.author.lastName}</h4>
                        <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true })} &middot; Public
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <p className="mb-4 text-gray-700">{currentPost.content}</p>
                {currentPost.imageUrl && <img src={currentPost.imageUrl} alt="Post content" className="object-cover w-full rounded-lg" />}
            </div>

            <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                <span>
                    {currentPost.likes.length > 0 && `${currentPost.likes.length} Likes`}
                </span>
                <span>
                    {currentPost.comments.length > 0 && `${currentPost.comments.length} Comments`}
                </span>
            </div>
            <hr />

            <div className="flex justify-around py-1">
                <button onClick={handlePostLikeToggle} className={`flex items-center justify-center w-full gap-2 py-2 font-semibold rounded-lg hover:bg-gray-100 transition-colors ${isLikedByCurrentUser ? 'text-blue-600' : 'text-gray-600'}`}>
                    {isLikedByCurrentUser ? 'Liked' : 'Like'}
                </button>
                <button className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-gray-600 rounded-lg hover:bg-gray-100">Comment</button>
                <button className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-gray-600 rounded-lg hover:bg-gray-100">Share</button>
            </div>
            <hr />

            <div className="pt-4">
                <form onSubmit={handleCommentSubmit} className="flex items-start mt-4 space-x-3">
                    <img src={user?.profilePicture || '/src/assets/images/profile.png'} alt="Your avatar" className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                        <textarea 
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            className="w-full p-2 text-sm bg-gray-100 border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-blue-500" 
                            rows="1" 
                            placeholder="Write a comment..."
                        />
                    </div>
                    <button type="submit" disabled={isSubmittingComment || !commentContent.trim()} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {isSubmittingComment ? '...' : 'Post'}
                    </button>
                </form>

                <div className="mt-6 space-y-4">
                    {currentPost.comments.map(comment => (
                        <Comment key={comment._id} postId={currentPost._id} commentData={comment} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostCard;