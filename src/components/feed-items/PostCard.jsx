import React, { useState, useEffect, useRef, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { likePost, addComment, likeComment, addReply, likeReply, getLikers, deletePost } from '../../api/posts';
import ClipLoader from "react-spinners/ClipLoader";
import { BsBookmark, BsBell, BsEyeSlash, BsPencil, BsTrash, BsThreeDots } from 'react-icons/bs';
import Swal from 'sweetalert2'; // Import SweetAlert2

// ===================================================================
// SUB-COMPONENT 1: LIKERS MODAL
// ===================================================================
const LikersModal = ({ isOpen, onClose, fetchLikers }) => {
    const [likers, setLikers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const loadLikers = async () => {
            setLoading(true);
            try {
                const data = await fetchLikers();
                setLikers(data);
            } catch (error) {
                console.error("Failed to fetch likers:", error);
            } finally {
                setLoading(false);
            }
        };
        loadLikers();
    }, [isOpen, fetchLikers]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4">Liked by</h3>
                {loading ? <div className="flex justify-center"><ClipLoader size={30} /></div> : (
                    <ul className="space-y-3 max-h-80 overflow-y-auto">
                        {likers.length > 0 ? likers.map(liker => (
                            <li key={liker._id} className="flex items-center space-x-3">
                                <img src={liker.profilePicture || '/src/assets/images/profile.png'} alt={liker.firstName} className="w-10 h-10 rounded-full object-cover" />
                                <span>{liker.firstName} {liker.lastName}</span>
                            </li>
                        )) : <p className="text-gray-500">No one has liked this yet.</p>}
                    </ul>
                )}
            </div>
        </div>
    );
};

// ===================================================================
// SUB-COMPONENT 2: POST OPTIONS MENU (with SweetAlert2)
// ===================================================================
const PostOptionsMenu = ({ post, user, token, menuRef, onClose, onPostDeleted }) => {
    const isAuthor = post.author._id === user?._id;

    const handleDelete = () => {
        onClose(); // Close the dropdown menu first
        
        // Use SweetAlert2 for a better confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deletePost(post._id, token);
                    // Show a success message
                    Swal.fire(
                        'Deleted!',
                        'Your post has been deleted.',
                        'success'
                    );
                    // Update the feed
                    onPostDeleted(post._id);
                } catch (error) {
                    console.error("Failed to delete post:", error);
                    // Show an error message
                    Swal.fire(
                        'Failed!',
                        'Could not delete the post. Please try again.',
                        'error'
                    );
                }
            }
        });
    };

    const MenuItem = ({ icon, text, onClick, isDestructive = false }) => (
        <button onClick={onClick} className={`flex items-center w-full gap-3 px-4 py-2 text-left text-sm transition-colors duration-150 ${ isDestructive ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100' }`}>
            <span className="p-2 bg-gray-100 rounded-full">{icon}</span>
            <span className="font-semibold">{text}</span>
        </button>
    );

    return (
        <div ref={menuRef} className="absolute right-0 z-20 w-64 mt-2 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-2">
            <MenuItem icon={<BsBookmark size={16} />} text="Save Post" />
            <MenuItem icon={<BsBell size={16} />} text="Turn On Notification" />
            <MenuItem icon={<BsEyeSlash size={16} />} text="Hide" />
            {isAuthor && (
                <>
                    <hr className="my-1" />
                    <MenuItem icon={<BsPencil size={16} />} text="Edit Post" />
                    <MenuItem icon={<BsTrash size={16} />} text="Delete Post" onClick={handleDelete} isDestructive />
                </>
            )}
        </div>
    );
};

// ===================================================================
// SUB-COMPONENT 3: A SINGLE REPLY
// ===================================================================
const Reply = ({ postId, commentId, replyData, onReplyUpdated, onLikersClick }) => {
    const { user, token } = useAuth();
    const isLikedByCurrentUser = replyData.likes.some(likeId => (likeId._id || likeId).toString() === user?._id);

    const handleReplyLikeToggle = async () => {
        if (!user) return;
        const newLikes = isLikedByCurrentUser 
            ? replyData.likes.filter(id => (id._id || id).toString() !== user._id) 
            : [...replyData.likes, user._id];
        onReplyUpdated({ ...replyData, likes: newLikes });
        try { 
            await likeReply(postId, commentId, replyData._id, token); 
        } catch (error) { 
            onReplyUpdated(replyData); 
        }
    };

    return (
        <div className="flex items-start space-x-3 ml-12">
            <img src={replyData.author.profilePicture || '/src/assets/images/profile.png'} alt={replyData.author.firstName} className="object-cover w-8 h-8 rounded-full"/>
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

// ===================================================================
// SUB-COMPONENT 4: A SINGLE COMMENT
// ===================================================================
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
                </form>
            )}
        </div>
    );
};

// ===================================================================
// MAIN COMPONENT: THE POST CARD
// ===================================================================
const PostCard = ({ post, onPostDeleted }) => {
    const { user, token } = useAuth();
    const [currentPost, setCurrentPost] = useState(post);
    const [commentContent, setCommentContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [likersQuery, setLikersQuery] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => { setCurrentPost(post); }, [post]);
    
    const isLikedByCurrentUser = currentPost.likes.some(likeId => (likeId._id || likeId).toString() === user?._id);

    const handlePostLikeToggle = async () => {
        if (!user) return;
        const originalLikes = currentPost.likes;
        const newLikes = isLikedByCurrentUser ? originalLikes.filter(id => (id._id || id).toString() !== user._id) : [...originalLikes, user._id];
        setCurrentPost(prev => ({ ...prev, likes: newLikes }));
        try { await likePost(currentPost._id, token); } 
        catch (error) { setCurrentPost(prev => ({ ...prev, likes: originalLikes })); }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent.trim() || !user) return;
        try {
            const newComment = await addComment(currentPost._id, commentContent, token);
            setCurrentPost(prev => ({ ...prev, comments: [newComment, ...prev.comments] }));
            setCommentContent('');
        } catch (error) { console.error("Failed to add comment:", error); }
    };

    const handleCommentUpdated = (commentId, updatedComment) => {
        setCurrentPost(prevPost => ({ ...prevPost, comments: prevPost.comments.map(c => c._id === commentId ? updatedComment : c) }));
    };

    const handleLikersClick = (ids = {}) => {
        setLikersQuery(ids);
        setIsModalOpen(true);
    };

    const fetchLikersForModal = useCallback(() => getLikers(currentPost._id, likersQuery, token), [currentPost._id, likersQuery, token]);

    if (!currentPost || !currentPost.author) return null;

    return (
        <>
            <LikersModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchLikers={fetchLikersForModal} />
            <div className="p-4 mb-6 bg-white rounded-lg shadow md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <img src={currentPost.author.profilePicture || '/src/assets/images/profile.png'} alt={currentPost.author.firstName} className="object-cover w-12 h-12 rounded-full" />
                        <div>
                            <h4 className="font-bold text-gray-800">{currentPost.author.firstName} {currentPost.author.lastName}</h4>
                            <p className="text-sm text-gray-500">{formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true })} &middot; <span className="font-semibold">Public</span></p>
                        </div>
                    </div>
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
                            <BsThreeDots className="w-5 h-5" />
                        </button>
                        {isMenuOpen && <PostOptionsMenu post={currentPost} user={user} token={token} menuRef={menuRef} onClose={() => setIsMenuOpen(false)} onPostDeleted={onPostDeleted} />}
                    </div>
                </div>
                <div className="mb-4">
                    <p className="mb-4 text-gray-700">{currentPost.content}</p>
                    {currentPost.imageUrl && <img src={currentPost.imageUrl} alt="Post content" className="object-cover w-full rounded-lg" />}
                </div>
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <button onClick={() => handleLikersClick()} className="hover:underline">{currentPost.likes.length > 0 && `${currentPost.likes.length} Likes`}</button>
                    <span>{currentPost.comments.length > 0 && `${currentPost.comments.length} Comments`}</span>
                </div>
                <hr />
                <div className="flex justify-around py-1">
                     <button onClick={handlePostLikeToggle} className={`flex items-center justify-center w-full gap-2 py-2 font-semibold rounded-lg hover:bg-gray-100 transition-colors ${isLikedByCurrentUser ? 'text-blue-600' : 'text-gray-600'}`}>Like</button>
                     <button className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-gray-600 rounded-lg hover:bg-gray-100">Comment</button>
                     <button className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-gray-600 rounded-lg hover:bg-gray-100">Share</button>
                </div>
                <hr />
                <div className="pt-4">
                    <form onSubmit={handleCommentSubmit} className="flex items-start mt-4 space-x-3">
                        <img src={user?.profilePicture || '/src/assets/images/profile.png'} alt="Your avatar" className="w-10 h-10 rounded-full" />
                        <input value={commentContent} onChange={(e) => setCommentContent(e.target.value)} className="w-full p-2 text-sm bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Write a comment..." />
                        <button type="submit" disabled={!commentContent.trim()} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">Post</button>
                    </form>
                    <div className="mt-6 space-y-4">
                        {currentPost.comments.map(comment => <Comment key={comment._id} postId={currentPost._id} commentData={comment} onCommentUpdated={handleCommentUpdated} onLikersClick={handleLikersClick} />)}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostCard;