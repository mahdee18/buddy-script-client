import React from 'react';

const FriendListItem = ({ name, title, imgSrc, isActive }) => (
    <div className="flex items-center justify-between p-2 transition rounded-lg hover:bg-gray-100">
        <div className="flex items-center space-x-3">
            <img src={imgSrc} alt={name} className="w-12 h-12 rounded-full" />
            <div><h4 className="font-semibold text-gray-800 ">{name}</h4><p className="text-sm text-gray-500 ">{title}</p></div>
        </div>
        {isActive ? <div className="relative w-3.5 h-3.5"><span className="absolute w-full h-full bg-green-500 border-2 border-white rounded-full"></span></div> : <span className="text-xs text-gray-400">5m ago</span>}
    </div>
);




const RightSidebar = () => {
    return (
        <div className="hidden space-y-6 lg:block">
            <div className="hidden space-y-6 lg:block">
                <div className="relative p-6 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-800">You Might Like</h4>
                        <a href="#" className="text-sm font-semibold text-blue-600">See All</a>
                    </div>
                    <hr />
                    <div className="pt-4 text-center">
                        <img src="/src/assets/images/Avatar.png" alt="Radovan SkillArena" className="w-16 h-16 mx-auto rounded-full" />
                        <h4 className="mt-3 font-bold text-gray-800">Radovan SkillArena</h4>
                        <p className="text-sm text-gray-500">Founder & CEO at Trophy</p>
                        <div className="flex gap-3 mt-4">
                            <button className="w-1/2 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Ignore</button>
                            <button className="w-1/2 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Follow</button>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-800">Your Friends</h4>
                        <a href="#" className="text-sm font-semibold text-blue-600">See All</a>
                    </div>
                    <div className="relative mb-4">
                        <input type="search" placeholder="Search friends..." className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border-gray-200 rounded-lg focus:outline-none" />
                        <svg className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 top-1/2 left-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 17"><circle cx="7" cy="7" r="6" stroke="currentColor" /><path stroke="currentColor" strokeLinecap="round" d="M16 16l-3-3" /></svg>
                    </div>
                    <div className="space-y-1">
                        <FriendListItem name="Steve Jobs" title="CEO of Apple" imgSrc="/src/assets/images/people1.png" isActive={false} />
                        <FriendListItem name="Ryan Roslansky" title="CEO of Linkedin" imgSrc="/src/assets/images/people2.png" isActive={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;