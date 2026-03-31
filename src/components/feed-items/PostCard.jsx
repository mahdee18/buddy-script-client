import React, { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick';
import { likePost, addComment, getLikers, updatePostVisibility } from '../../api/posts';
import { BsThreeDots, BsGlobe, BsLockFill } from 'react-icons/bs';
import { FiSend, FiMic, FiImage } from 'react-icons/fi';
import { BiLike, BiMessageRounded } from 'react-icons/bi';
import { RiShareForwardLine } from 'react-icons/ri';

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

    useEffect(() => { setCurrentPost(post); }, [post]);

    const isAuthor = user?._id === (currentPost?.author?._id || currentPost?.author);
    const isLikedByCurrentUser = currentPost?.likes?.some(
        likeId => (likeId._id || likeId).toString() === user?._id
    );

    const [userReaction, setUserReaction] = useState(isLikedByCurrentUser ? 'Like' : null);

    // ─── CALCULATE TOTAL COMMENTS + REPLIES ───
    const totalCommentsAndReplies = currentPost.comments?.reduce((total, comment) => {
        return total + 1 + (comment.replies?.length || 0);
    }, 0) || 0;

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
            setCurrentPost(prev => ({ ...prev, visibility: originalVisibility }));
        }
    };

    const handleReactionClick = async (reactionType) => {
        if (!user) return;
        
        const originalLikes = currentPost.likes;
        const isAlreadyLiked = isLikedByCurrentUser;

        if (userReaction === reactionType) {
            setUserReaction(null);
            setCurrentPost(prev => ({ ...prev, likes: prev.likes.filter(id => (id._id || id).toString() !== user._id) }));
        } else {
            setUserReaction(reactionType);
            if (!isAlreadyLiked) {
                setCurrentPost(prev => ({ ...prev, likes: [...prev.likes, user._id] }));
            }
        }

        try {
            if (!isAlreadyLiked || userReaction === reactionType) {
                await likePost(currentPost._id);
            }
        } catch (error) {
            setUserReaction(isAlreadyLiked ? 'Like' : null);
            setCurrentPost(prev => ({ ...prev, likes: originalLikes }));
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent.trim() || !user) return;

        const content = commentContent;
        const tempId = `temp-${Date.now()}`;

        const optimisticComment = { _id: tempId, content, author: user, createdAt: new Date().toISOString(), likes: [], replies: [] };
        setCurrentPost(prev => ({ ...prev, comments: [...(prev.comments || []), optimisticComment] }));
        setCommentContent('');

        try {
            const response = await addComment(currentPost._id, content);
            const data = response?.data || response;

            setCurrentPost(prev => {
                let updatedComments = [...(prev.comments || [])];
                if (data && data._id === prev._id) {
                    const serverComments = data.comments || [];
                    const lastServerComment = serverComments[serverComments.length - 1];
                    const realCommentId = typeof lastServerComment === 'object' ? lastServerComment._id : lastServerComment;
                    if (realCommentId) updatedComments = updatedComments.map(c => c._id === tempId ? { ...c, _id: realCommentId } : c);
                } else if (data && data._id && data._id !== prev._id) {
                    updatedComments = updatedComments.map(c => c._id === tempId ? { ...data, author: user, replies: [] } : c);
                }
                return { ...prev, comments: updatedComments };
            });
        } catch (error) {
            setCurrentPost(prev => ({ ...prev, comments: (prev.comments || []).filter(c => c._id !== tempId) }));
        }
    };

    const handleCommentUpdated = useCallback((updatedComment) => {
        setCurrentPost(prev => ({ ...prev, comments: prev.comments.map(c => c._id === updatedComment._id ? updatedComment : c) }));
    }, []);

    const handleLikersClick = (ids = {}) => {
        setLikersQuery(ids);
        setIsLikersModalOpen(true);
    };

    if (!currentPost || !currentPost.author) return null;

    const renderStackedAvatars = () => {
        const maxToShow = 5;
        const displayLikes = currentPost.likes.slice(0, maxToShow);
        const extraCount = currentPost.likes.length - maxToShow;

        return (
            <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleLikersClick()}>
                {displayLikes.map((like, i) => (
                    <img 
                        key={i} 
                        src={like.profilePicture || '/profile.png'} 
                        alt="User" 
                        className={`w-6 h-6 rounded-full border-[2px] border-white object-cover relative ${i > 0 ? '-ml-2' : ''}`}
                        style={{ zIndex: 10 - i }}
                    />
                ))}
                {extraCount > 0 && (
                    <div className="w-6 h-6 rounded-full border-[2px] border-white bg-blue-500 flex items-center justify-center -ml-2 relative z-0">
                        <span className="text-white text-[9px] font-bold">9+</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <LikersModal isOpen={isLikersModalOpen} onClose={() => setIsLikersModalOpen(false)} fetchLikers={() => getLikers(currentPost._id, likersQuery)} />
            <VisibilityModal isOpen={isVisibilityModalOpen} onClose={() => setIsVisibilityModalOpen(false)} currentVisibility={currentPost.visibility || 'public'} onUpdate={handleVisibilityChange} />

            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 pb-3">
                
                {/* ── Header ── */}
                <div className="flex items-center justify-between p-4 pb-2">
                    <div className="flex items-center space-x-2.5">
                        <img src={currentPost.author.profilePicture || '/profile.png'} alt="User" className="object-cover w-10 h-10 rounded-full" />
                        <div>
                            <h4 className="font-semibold text-gray-900 text-[15px]">
                                {currentPost.author.firstName} {currentPost.author.lastName}
                            </h4>
                            <div className="text-[13px] text-gray-500 flex items-center gap-1 mt-0.5">
                                <span>{formatDistanceToNowStrict(new Date(currentPost.createdAt))} ago</span>
                                <span>.</span>
                                {isAuthor ? (
                                    <button onClick={() => setIsVisibilityModalOpen(true)} className="capitalize inline-flex items-center gap-1 hover:underline">
                                        {currentPost.visibility === 'private' ? <BsLockFill size={11} /> : <BsGlobe size={11} />}
                                        {currentPost.visibility || 'Public'}
                                    </button>
                                ) : (
                                    <span className="capitalize inline-flex items-center gap-1">
                                        {currentPost.visibility === 'private' ? <BsLockFill size={11} /> : <BsGlobe size={11} />}
                                        {currentPost.visibility || 'Public'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {isAuthor && (
                        <div className="relative">
                            <button onClick={() => setIsMenuOpen(true)} className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
                                <BsThreeDots className="w-5 h-5" />
                            </button>
                            {isMenuOpen && <PostOptionsMenu post={currentPost} menuRef={menuRef} onClose={() => setIsMenuOpen(false)} onPostDeleted={onPostDeleted} />}
                        </div>
                    )}
                </div>

                {/* ── Body ── */}
                <div className="px-4 mb-3">
                    <p className="text-[15px] text-gray-900 whitespace-pre-wrap">{currentPost.content}</p>
                </div>
                
                {currentPost.imageUrl && (
                    <div className="px-4">
                        <img src={currentPost.imageUrl} alt="Post content" className="object-cover w-full max-h-[500px] rounded-lg border border-gray-100" />
                    </div>
                )}

                {/* ── Counts Bar ── */}
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Left: Stacked Avatars */}
                    <div>
                        {currentPost.likes?.length > 0 && renderStackedAvatars()}
                    </div>
                    {/* Right: Text Counts (Now correctly counts replies too) */}
                    <div className="flex items-center gap-3 text-[14px] text-gray-500">
                        {totalCommentsAndReplies > 0 && (
                            <span className="cursor-pointer hover:underline">
                                {totalCommentsAndReplies} {totalCommentsAndReplies === 1 ? 'Comment' : 'Comments'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="px-4"><hr className="border-gray-200" /></div>

                {/* ── Action buttons ── */}
                <div className="flex items-center justify-between px-3 py-1 mt-1 gap-1">
                    
                    <div className="relative group flex-1">
                        <div className="absolute bottom-1/2 left-0 w-full h-10 z-40"></div>
                        
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-100 z-50">
                            <button onClick={() => handleReactionClick('Like')} className="text-[26px] hover:scale-125 hover:-translate-y-1 transition-all origin-bottom">👍</button>
                            <button onClick={() => handleReactionClick('Love')} className="text-[26px] hover:scale-125 hover:-translate-y-1 transition-all origin-bottom">❤️</button>
                            <button onClick={() => handleReactionClick('Haha')} className="text-[26px] hover:scale-125 hover:-translate-y-1 transition-all origin-bottom">😆</button>
                        </div>
                        
                        <button 
                            onClick={() => handleReactionClick(userReaction || 'Like')} 
                            className={`flex items-center justify-center w-full gap-2 py-2 font-semibold text-[15px] rounded-lg transition-colors
                                ${userReaction ? 'bg-[#eaf3ff] text-blue-600' : 'text-gray-500 hover:bg-gray-100'}
                            `}
                        >
                            {userReaction === 'Like' && <span className="text-lg">👍</span>}
                            {userReaction === 'Love' && <span className="text-lg">❤️</span>}
                            {userReaction === 'Haha' && <span className="text-lg">😆</span>}
                            {!userReaction && <BiLike className="text-[22px]" />}
                            
                            <span>{userReaction ? userReaction : 'Like'}</span>
                        </button>
                    </div>

                    <button className="flex items-center justify-center flex-1 gap-2 py-2 font-semibold text-[15px] text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
                        <BiMessageRounded className="text-[22px]" /> Comment
                    </button>
                    
                    <button className="flex items-center justify-center flex-1 gap-2 py-2 font-semibold text-[15px] text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
                        <RiShareForwardLine className="text-[22px]" /> Share
                    </button>
                </div>

                <div className="px-4 mb-2"><hr className="border-gray-200" /></div>

                {/* ── Comments Section ── */}
                <div className="px-4 pt-1">
                    {currentPost.comments?.length > 2 && (
                        <button className="text-[15px] font-semibold text-gray-500 mb-4 hover:underline text-left w-full">
                            View previous comments
                        </button>
                    )}

                    <div className="space-y-3 mb-2">
                        {currentPost.comments?.map(comment => (
                            <Comment key={comment._id} postId={currentPost._id} commentData={comment} onCommentUpdated={handleCommentUpdated} onLikersClick={handleLikersClick} />
                        ))}
                    </div>

                    <form onSubmit={handleCommentSubmit} className="flex items-center w-full bg-[#f0f2f5] rounded-full px-2 py-1.5 mt-4">
                        <img src={user?.profilePicture || '/profile.png'} alt="Avatar" className="w-8 h-8 rounded-full object-cover mr-2" />
                        <input value={commentContent} onChange={e => setCommentContent(e.target.value)} className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] placeholder-gray-500" placeholder="Write a comment..." />
                        <div className="flex items-center gap-3 pr-2 text-gray-400">
                            <button type="button" className="hover:text-gray-600 transition-colors"><FiMic size={18} /></button>
                            <button type="button" className="hover:text-gray-600 transition-colors"><FiImage size={18} /></button>
                            {commentContent.trim() && <button type="submit" className="text-blue-600 transition-colors ml-1"><FiSend size={18} /></button>}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PostCard;