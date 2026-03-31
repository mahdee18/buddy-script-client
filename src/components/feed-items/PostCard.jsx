import React, { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick';
import { likePost, addComment, getLikers, updatePostVisibility } from '../../api/posts';
import { BsThreeDots, BsGlobe, BsLockFill } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';

import LikersModal from '../post/LikersModal';
import Comment from '../post/Comment';
import PostOptionsMenu from '../post/PostOptionsMenu';
import VisibilityModal from '../post/VisibilityModal';

const PostCard = ({ post, onPostDeleted }) => {
    const { user } = useAuth();
    const [currentPost, setCurrentPost] = useState(post);
    const [commentContent, setCommentContent] = useState('');
    const [isLikersModalOpen, setIsLikersModalOpen] = useState(false);
    const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false);
    const [likersQuery, setLikersQuery] = useState({});
    const [isMenuOpen, setIsMenuOpen, menuRef] = useDetectOutsideClick(false);

    // Keep local state in sync if the parent feed re-renders this post
    useEffect(() => { setCurrentPost(post); }, [post]);

    const isAuthor = user?._id === (currentPost?.author?._id || currentPost?.author);
    
    const isLikedByCurrentUser = currentPost?.likes?.some(
        likeId => (likeId._id || likeId).toString() === user?._id
    );

    // ─── Visibility ────────────────────────────────────────────────────────────
    const handleVisibilityChange = async (newVisibility) => {
        if (newVisibility === currentPost.visibility) {
            setIsVisibilityModalOpen(false);
            return;
        }
        const originalVisibility = currentPost.visibility;
        setCurrentPost(prev => ({ ...prev, visibility: newVisibility }));
        setIsVisibilityModalOpen(false);
        try {
            await updatePostVisibility(currentPost._id, newVisibility);
        } catch (error) {
            console.error('Failed to update visibility', error);
            setCurrentPost(prev => ({ ...prev, visibility: originalVisibility }));
        }
    };

    // ─── Post like ─────────────────────────────────────────────────────────────
    const handlePostLikeToggle = async () => {
        if (!user) return;
        const originalLikes = currentPost.likes;
        const newLikes = isLikedByCurrentUser
            ? originalLikes.filter(id => (id._id || id).toString() !== user._id)
            : [...originalLikes, user._id];

        setCurrentPost(prev => ({ ...prev, likes: newLikes }));
        try {
            await likePost(currentPost._id);
        } catch (error) {
            setCurrentPost(prev => ({ ...prev, likes: originalLikes }));
        }
    };

    // ─── Add comment (optimistic) ──────────────────────────────────────────────
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent.trim() || !user) return;

        const content = commentContent;
        const tempId = `temp-${Date.now()}`;

        // Show the comment instantly on screen
        const optimisticComment = {
            _id: tempId,
            content,
            author: user,
            createdAt: new Date().toISOString(),
            likes: [],
            replies: [],
        };

        setCurrentPost(prev => ({
            ...prev,
            comments: [...(prev.comments || []), optimisticComment],
        }));
        setCommentContent('');

        try {
            const response = await addComment(currentPost._id, content);
            const data = response?.data || response;

            setCurrentPost(prev => {
                let updatedComments = [...(prev.comments || [])];

                // SCENARIO 1: Backend returns the entire Post object
                if (data && data._id === prev._id) {
                    // Grab the last comment ID from the server's array
                    const serverComments = data.comments || [];
                    const lastServerComment = serverComments[serverComments.length - 1];
                    
                    // It might be a string ID or an object, we handle both safely
                    const realCommentId = typeof lastServerComment === 'object' ? lastServerComment._id : lastServerComment;

                    if (realCommentId) {
                        // Swap the tempId with the REAL ID so replies and likes work!
                        updatedComments = updatedComments.map(c => 
                            c._id === tempId ? { ...c, _id: realCommentId } : c
                        );
                    }
                } 
                // SCENARIO 2: Backend returns the single new comment object
                else if (data && data._id && data._id !== prev._id) {
                    updatedComments = updatedComments.map(c => 
                        c._id === tempId ? { ...data, author: user, replies: [] } : c
                    );
                }

                // Strictly update comments array, leave EVERYTHING else completely alone
                return { ...prev, comments: updatedComments };
            });

        } catch (error) {
            console.error('Failed to add comment:', error);
            setCurrentPost(prev => ({
                ...prev,
                comments: (prev.comments || []).filter(c => c._id !== tempId),
            }));
        }
    };

    // ─── Comment updated from inside Comment component ─────────────────────────
    const handleCommentUpdated = useCallback((updatedComment) => {
        setCurrentPost(prev => ({
            ...prev,
            comments: prev.comments.map(c =>
                c._id === updatedComment._id ? updatedComment : c
            ),
        }));
    }, []);

    // ─── Likers modal ──────────────────────────────────────────────────────────
    const handleLikersClick = (ids = {}) => {
        setLikersQuery(ids);
        setIsLikersModalOpen(true);
    };

    const fetchLikersForModal = useCallback(
        () => getLikers(currentPost._id, likersQuery),
        [currentPost._id, likersQuery]
    );

    if (!currentPost || !currentPost.author) return null;

    return (
        <>
            <LikersModal
                isOpen={isLikersModalOpen}
                onClose={() => setIsLikersModalOpen(false)}
                fetchLikers={fetchLikersForModal}
            />
            <VisibilityModal
                isOpen={isVisibilityModalOpen}
                onClose={() => setIsVisibilityModalOpen(false)}
                currentVisibility={currentPost.visibility || 'public'}
                onUpdate={handleVisibilityChange}
            />

            <div className="p-4 mb-6 bg-white rounded-lg shadow md:p-6">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <img
                            src={currentPost.author.profilePicture || '/profile.png'}
                            alt={currentPost.author.firstName || 'User'}
                            className="object-cover w-12 h-12 rounded-full"
                        />
                        <div>
                            <h4 className="font-bold text-gray-800">
                                {currentPost.author.firstName} {currentPost.author.lastName}
                            </h4>
                            <p className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true })} &middot;
                                {isAuthor ? (
                                    <button
                                        onClick={() => setIsVisibilityModalOpen(true)}
                                        className="font-semibold hover:underline capitalize inline-flex items-center gap-1.5 ml-1"
                                    >
                                        {currentPost.visibility === 'private' ? <BsLockFill size={11} /> : <BsGlobe size={11} />}
                                        {currentPost.visibility || 'Public'}
                                    </button>
                                ) : (
                                    <span className="font-semibold capitalize inline-flex items-center gap-1.5 ml-1">
                                        {currentPost.visibility === 'private' ? <BsLockFill size={11} /> : <BsGlobe size={11} />}
                                        {currentPost.visibility || 'Public'}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {isAuthor && (
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
                            >
                                <BsThreeDots className="w-5 h-5" />
                            </button>
                            {isMenuOpen && (
                                <PostOptionsMenu
                                    post={currentPost}
                                    menuRef={menuRef}
                                    onClose={() => setIsMenuOpen(false)}
                                    onPostDeleted={onPostDeleted}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* ── Body ── */}
                <div className="mb-4">
                    <p className="mb-4 text-gray-700 whitespace-pre-wrap">{currentPost.content}</p>
                    {currentPost.imageUrl && (
                        <img src={currentPost.imageUrl} alt="Post content" className="object-cover w-full rounded-lg" />
                    )}
                </div>

                {/* ── Counts ── */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <button onClick={() => handleLikersClick()} className="hover:underline">
                        {currentPost.likes?.length > 0 && `${currentPost.likes.length} Likes`}
                    </button>
                    <span>{currentPost.comments?.length > 0 && `${currentPost.comments.length} Comments`}</span>
                </div>

                <hr />

                {/* ── Action buttons ── */}
                <div className="flex justify-around py-1">
                    <button
                        onClick={handlePostLikeToggle}
                        className={`flex items-center justify-center w-full gap-2 py-2 font-semibold rounded-lg hover:bg-gray-100 transition-colors ${isLikedByCurrentUser ? 'text-blue-600' : 'text-gray-600'}`}
                    >
                        Like
                    </button>
                    <button className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-gray-600 rounded-lg hover:bg-gray-100">
                        Comment
                    </button>
                    <button className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-gray-600 rounded-lg hover:bg-gray-100">
                        Share
                    </button>
                </div>

                <hr />

                {/* ── Comment input ── */}
                <div className="pt-4">
                    <form onSubmit={handleCommentSubmit} className="flex items-start mt-4 space-x-3">
                        <img
                            src={user?.profilePicture || '/profile.png'}
                            alt="Your avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <input
                            value={commentContent}
                            onChange={e => setCommentContent(e.target.value)}
                            className="w-full p-2 text-sm bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Write a comment..."
                        />
                        <button
                            type="submit"
                            disabled={!commentContent.trim()}
                            className="p-2.5 text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            <FiSend size={18} />
                        </button>
                    </form>

                    {/* ── Comments list ── */}
                    <div className="mt-6 space-y-4">
                        {currentPost.comments?.map(comment => (
                            <Comment
                                key={comment._id}
                                postId={currentPost._id}
                                commentData={comment}
                                onCommentUpdated={handleCommentUpdated}
                                onLikersClick={handleLikersClick}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostCard;