import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { likeReply } from '../../api/posts';
import { FaThumbsUp } from 'react-icons/fa';

const Reply = ({ postId, commentId, replyData, onReplyUpdated, onLikersClick }) => {
    const { user, token } = useAuth();
    
    // Safely check likes
    const isLikedByCurrentUser = replyData?.likes?.some(
        likeId => (likeId._id || likeId).toString() === user?._id
    );

    const handleReplyLikeToggle = async () => {
        if (!user) return;
        
        const originalLikes = replyData.likes || [];
        const newLikes = isLikedByCurrentUser 
            ? originalLikes.filter(id => (id._id || id).toString() !== user._id) 
            : [...originalLikes, user._id];
            
        // Optimistic UI Update
        onReplyUpdated({ ...replyData, likes: newLikes });
        
        try { 
            await likeReply(postId, commentId, replyData._id, token); 
        } catch (error) { 
            // Revert on failure
            onReplyUpdated({ ...replyData, likes: originalLikes }); 
        }
    };

    if (!replyData?.author) return null;

    // Format time Facebook style (e.g., "1h", "2m")
    const timeAgo = formatDistanceToNow(new Date(replyData.createdAt), { addSuffix: true })
        .replace('about ', '')
        .replace(' hours', 'h')
        .replace(' hour', 'h')
        .replace(' minutes', 'm')
        .replace(' minute', 'm')
        .replace(' seconds', 's')
        .replace(' second', 's');

    return (
        <div className="flex items-start space-x-2 w-full mt-1.5">
            {/* Avatar (Slightly smaller for replies: w-7 h-7) */}
            <img 
                src={replyData.author.profilePicture || '/profile.png'} 
                alt={replyData.author.firstName} 
                className="object-cover w-7 h-7 rounded-full mt-1"
            />
            
            <div className="flex-1 relative flex flex-col items-start">
                {/* The Gray Bubble */}
                <div className="relative inline-block bg-[#f0f2f5] rounded-2xl px-3.5 py-2 max-w-full">
                    <p className="text-[13px] font-bold text-gray-900 leading-tight mb-0.5">
                        {replyData.author.firstName} {replyData.author.lastName}
                    </p>
                    <p className="text-[14px] text-gray-800 leading-snug break-words">
                        {replyData.content}
                    </p>

                    {/* Overlapping Likes Badge (Only shows if there are likes) */}
                    {replyData.likes?.length > 0 && (
                        <div 
                            onClick={() => onLikersClick({ replyId: replyData._id })} 
                            className="absolute -bottom-2 -right-3 flex items-center bg-white rounded-full p-[2px] shadow-sm px-1.5 cursor-pointer z-10 border border-gray-100"
                        >
                            <div className="z-20 text-blue-500 bg-white rounded-full flex items-center justify-center">
                                <FaThumbsUp className="text-[10px] m-[2px]" />
                            </div>
                            <span className="text-[11px] text-gray-600 ml-1 font-medium pr-0.5">
                                {replyData.likes.length}
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Links Below Bubble */}
                <div className="flex items-center gap-1.5 ml-3 mt-1 text-[12px] font-bold text-gray-600">
                    <button 
                        onClick={handleReplyLikeToggle} 
                        className={`hover:underline ${isLikedByCurrentUser ? 'text-blue-600' : ''}`}
                    >
                        Like
                    </button>
                    
                    <span className="font-normal text-gray-500 ml-0.5">. {timeAgo}</span>
                </div>
            </div>
        </div>
    );
};

export default Reply;