import React, { useState, useCallback } from 'react';
import CreatePostTrigger from '../common/CreatePostTrigger';
import CreatePostModalForm from '../common/CreatePostModalForm';

/** Manages the state for the post creation flow. */
const CreatePost = ({ onPostCreated }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    const handlePostCreation = useCallback((newPost) => {
        onPostCreated?.(newPost);
        closeModal();
    }, [onPostCreated, closeModal]);

    return (
        <>
            {/* This is the trigger that is always visible on the feed */}
            <CreatePostTrigger onClick={openModal} />

        {/* This is the modal that opens when the trigger is clicked */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                >
                {/* Prevents modal from closing when clicking inside it */}
                    <div onClick={e => e.stopPropagation()}>
                        <CreatePostModalForm 
                            onPostCreated={handlePostCreation} 
                            onClose={closeModal} 
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default CreatePost;