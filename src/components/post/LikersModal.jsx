import React, { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4">Liked by</h3>
                {loading ? <div className="flex justify-center"><ClipLoader size={30} /></div> : (
                    <ul className="space-y-3 max-h-80 overflow-y-auto">
                        {likers.length > 0 ? likers.map(liker => (
                            <li key={liker._id} className="flex items-center space-x-3">
                                <img src={liker.profilePicture || '/images/profile.png'} alt={liker.firstName} className="w-10 h-10 rounded-full object-cover" />
                                <span>{liker.firstName} {liker.lastName}</span>
                            </li>
                        )) : <p className="text-gray-500">No one has liked this yet.</p>}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default LikersModal;