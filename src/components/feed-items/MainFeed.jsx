import React, { useEffect, useState,  } from 'react'; 
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import Stories from './Stories';
import ClipLoader from "react-spinners/ClipLoader";
import { getAllPosts } from '../../api/posts';

const MainFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const fetchedPosts = await getAllPosts();
                setPosts(fetchedPosts);
                setError('');
            } catch (err) {
                setError('Failed to load feed. Please try refreshing the page.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []); 
     const handlePostCreated = (newPost) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center my-12">
                    <ClipLoader color={"#3b82f6"} size={50} />
                </div>
            );
        }

        if (error) {
            return <p className="text-center text-red-500 my-8">{error}</p>;
        }

        if (posts.length === 0) {
            return <p className="text-center text-gray-500 my-8">No posts yet. Be the first to share something!</p>;
        }

        return posts.map(post => (
            <PostCard key={post._id} post={post} />
        ));
    };

    return (
        <div>
            <Stories />
            <CreatePost onPostCreated={handlePostCreated} />
            {renderContent()}
        </div>
    );
};

export default MainFeed;