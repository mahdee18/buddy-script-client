import React from 'react';
import { useFeed } from '../../hooks/useFeed';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import Stories from './Stories';
import ClipLoader from "react-spinners/ClipLoader";

const MainFeed = () => {
    const { posts, loading, error, addPost, removePost, updatePost } = useFeed();

    // A helper component to keep the return statement clean.
    const FeedContent = () => {
        if (loading) {
            return <div className="flex justify-center my-12"><ClipLoader color="#3b82f6" size={50} /></div>;
        }
        if (error) {
            return <p className="text-center text-red-500 my-8">{error}</p>;
        }
        if (posts.length === 0) {
            return <p className="text-center text-gray-500 my-8">No posts yet. Be the first to share something!</p>;
        }
        return (
            <div className="space-y-4">
                {posts.map(post => (
                    <PostCard 
                        key={post._id} 
                        post={post} 
                        onPostDeleted={removePost}
                        onPostUpdated={updatePost} 
                    />
                ))}
            </div>
        );
    };

    return (
        <main>
            <Stories />
            <CreatePost onPostCreated={addPost} />
            <FeedContent />
        </main>
    );
};

export default MainFeed;