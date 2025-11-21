import React from 'react';

const FriendListItem = ({ name, title, imgSrc, isActive }) => (
    <div className="flex items-center justify-between p-2 mb-2 rounded-lg hover:bg-gray-100">
        <div className="flex items-center space-x-3">
            <img src={imgSrc} alt={name} className="w-12 h-12 rounded-full" />
            <div>
                <h4 className="font-semibold text-gray-800">{name}</h4>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
        </div>
        {isActive ? (
            <div className="relative w-3.5 h-3.5">
                <span className="absolute w-full h-full bg-green-500 border-2 border-white rounded-full"></span>
            </div>
        ) : (
            <span className="text-xs text-gray-400">5m ago</span>
        )}
    </div>
);


const RightSidebar = () => {
    return (
        <div className="hidden lg:block">
            <div className="p-6 bg-white rounded-lg shadow">
                <h4 className="mb-6 text-lg font-semibold text-gray-800">Your Friends</h4>
                <div className="space-y-2">
                    <FriendListItem name="Steve Jobs" title="CEO of Apple" imgSrc="/src/assets/images/people1.png" isActive={false} />
                    <FriendListItem name="Ryan Roslansky" title="CEO of Linkedin" imgSrc="/src/assets/images/people2.png" isActive={true} />
                    <FriendListItem name="Dylan Field" title="CEO of Figma" imgSrc="/src/assets/images/people3.png" isActive={true} />
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;