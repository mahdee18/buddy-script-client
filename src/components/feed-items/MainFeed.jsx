import React from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

const dummyPosts = [
    {
        id: 1,
        author: { name: 'Karim Saif', avatar: '/src/assets/images/post_img.png' },
        timestamp: '5 minutes ago',
        content: '-Healthy Tracking App',
        imageUrl: '/src/assets/images/timeline_img.png',
        comments: [1, 2], 
        shares: 122,
    },
    {
        id: 2,
        author: { name: 'Steve Jobs', avatar: '/src/assets/images/people1.png' },
        timestamp: '1 hour ago',
        content: 'Excited to announce our new product lineup! It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        imageUrl: null, 
        comments: [1, 2, 3, 4],
        shares: 250,
    },
];

const MainFeed = () => {
    return (
        <div className="_layout_middle_wrap">
            <CreatePost />

            {dummyPosts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
};

export default MainFeed;