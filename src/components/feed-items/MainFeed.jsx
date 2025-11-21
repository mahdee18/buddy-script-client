// src/components/Feed/MainFeed.jsx
import React from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import Stories from './Stories';

const dummyPosts = [
    {
        id: 1,
        author: { name: 'Karim Saif', avatar: '/src/assets/images/post_img.png' },
        timestamp: '5 minutes ago',
        content: '-Healthy Tracking App',
        imageUrl: '/src/assets/images/timeline_img.png',
        shares: 122,
        comments: [
             {
                id: 'c1',
                author: { name: 'Radovan SkillArena', avatar: '/src/assets/images/txt_img.png' },
                content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
                timestamp: '21m'
             }
        ]
    },
];

const MainFeed = () => {
    return (
        <div>
            <Stories />
            <CreatePost />
            {dummyPosts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
};

export default MainFeed;