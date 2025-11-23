import React, { useState, useEffect, useRef } from 'react';
import Comment from './Comment';

const PostOptionsMenu = ({ menuRef }) => {
    
    const MenuItem = ({ icon, text }) => (
        <button className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
            <span className="text-blue-500">{icon}</span>
            <span className="ml-3">{text}</span>
        </button>
    );

    return (
        <div 
            ref={menuRef} 
            className="absolute right-0 z-20 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black/10 py-9 px-3 ring-opacity-5 focus:outline-none"
        >
            <div className="">
                <MenuItem
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z"/></svg>} 
                    text="Save Post" 
                />
                <MenuItem 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 20 22"><path fill="currentColor" d="M9.527 0C4.948 0 1.871 3.543 1.871 6.85c0 1.5.339 2.238.737 2.918l.161.27c.458.755.976 1.613.976 3.299.004 2.073-1.66 4.413-9.528 4.413-4.818 0-9.172-.337-9.531-4.478.463-.778.899-1.488.899-3.19C-16.142 3.543-13.065 0-8.473 0c-1.155 0-2.248.505-3.077 1.423a.762.762 0 00.057 1.083.774.774 0 001.092-.057c.533-.59 1.218-.915 1.93-.915.714 0 1.403.324 1.938.916.318.284.804.258 1.088-.058.832-.917 1.927-1.423 3.086-1.423z"/></svg>} 
                    text="Turn On Notification" 
                />
                 <MenuItem 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5"/></svg>} 
                    text="Hide" 
                />
                <MenuItem 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z"/></svg>} 
                    text="Edit Post" 
                />
                <MenuItem 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5"/></svg>} 
                    text="Delete Post" 
                />
            </div>
        </div>
    );
};

const PostCard = ({ post }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);


    return (
        <div className="p-4 mb-6 bg-white rounded-lg shadow md:p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full" />
                    <div>
                        <h4 className="font-bold text-gray-800">{post.author.name}</h4>
                        <p className="text-sm text-gray-500">{post.timestamp} &middot; Public</p>
                    </div>
                </div>

                <div className="relative">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                    </button>
                    
                    {isMenuOpen && <PostOptionsMenu menuRef={menuRef} />}
                </div>
            </div>

            <div className="mb-4">
                <p className="mb-4 text-gray-700">{post.content}</p>
                {post.imageUrl && <img src={post.imageUrl} alt="Post content" className="w-full rounded-lg" />}
            </div>

            <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                 <div className="flex items-center -space-x-2">
                    <img src="/src/assets/images/react_img1.png" className="w-6 h-6 border-2 border-white rounded-full" />
                    <img src="/src/assets/images/react_img2.png" className="w-6 h-6 border-2 border-white rounded-full" />
                    <span className="z-10 flex items-center justify-center w-6 h-6 text-xs font-semibold text-gray-600 bg-gray-200 border-2 border-white rounded-full">9+</span>
                </div>
                <div><span>{post.comments.length} Comments</span> &middot; <span>{post.shares} Shares</span></div>
            </div>
            <hr />

            <div className="flex justify-around py-1">
                <button className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-gray-600 rounded-lg hover:bg-gray-100">Haha</button>
                <button className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-gray-600 rounded-lg hover:bg-gray-100">Comment</button>
                <button className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-gray-600 rounded-lg hover:bg-gray-100">Share</button>
            </div>
            <hr />

            <div className="pt-4">
                {post.comments.map(comment => <Comment key={comment.id} comment={comment} />)}
                <div className="flex items-start mt-4 space-x-3">
                    <img src="/src/assets/images/profile.png" alt="Your avatar" className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                        <textarea className="w-full p-2 text-sm bg-gray-100 border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-gray-300" rows="1" placeholder="Write a comment..."></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;