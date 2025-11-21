import React from 'react';

const FriendListItem = ({ name, title, imgSrc, isActive }) => (
    <div className="flex items-center justify-between p-2 transition rounded-lg hover:bg-gray-100">
        <div className="flex items-center space-x-3">
            <img src={imgSrc} alt={name} className="w-12 h-12 rounded-full" />
            <div><h4 className="font-semibold text-gray-800">{name}</h4><p className="text-sm text-gray-500">{title}</p></div>
        </div>
        {isActive ? <div className="relative w-3.5 h-3.5"><span className="absolute w-full h-full bg-green-500 border-2 border-white rounded-full"></span></div> : <span className="text-xs text-gray-400">5m ago</span>}
    </div>
);

const DarkModeToggle = () => (
    <div className="absolute top-4 right-4">
        <button type="button" className="relative inline-flex items-center h-6 transition-colors duration-200 ease-in-out bg-gray-200 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span className="sr-only">Use setting</span>
            <span className="relative inline-block w-4 h-4 transition duration-200 ease-in-out transform translate-x-1 bg-white rounded-full pointer-events-none ring-0">
                {/* Moon Icon */}
                <span className="absolute inset-0 flex items-center justify-center w-full h-full transition-opacity duration-200 ease-in-out opacity-100" aria-hidden="true">
                    <svg className="w-3 h-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 11 16"><path fill="currentColor" d="M2.727 14.977l.04-.498-.04.498zm-1.72-.49l.489-.11-.489.11zM3.232 1.212L3.514.8l-.282.413zM9.792 8a6.5 6.5 0 00-6.5-6.5v-1a7.5 7.5 0 017.5 7.5h-1zm-6.5 6.5a6.5 6.5 0 006.5-6.5h1a7.5 7.5 0 01-7.5 7.5v-1zm-.525-.02c.173.013.348.02.525.02v1c-.204 0-.405-.008-.605-.024l.08-.997zm-.261-1.83A6.498 6.498 0 005.792 7h1a7.498 7.498 0 01-3.791 6.52l-.495-.87zM5.792 7a6.493 6.493 0 00-2.841-5.374L3.514.8A7.493 7.493 0 016.792 7h-1zm-3.105 8.476c-.528-.042-.985-.077-1.314-.155-.316-.075-.746-.242-.854-.726l.977-.217c-.028-.124-.145-.09.106-.03.237.056.6.086 1.165.131l-.08.997zm.314-1.956c-.622.354-1.045.596-1.31.792a.967.967 0 00-.204.185c-.01.013.027-.038.009-.12l-.977.218a.836.836 0 01.144-.666c.112-.162.27-.3.433-.42.324-.24.814-.519 1.41-.858L3 13.52zM3.292 1.5a.391.391 0 00.374-.285A.382.382 0 003.514.8l-.563.826A.618.618 0 012.702.95a.609.609 0 01.59-.45v1z" /></svg>
                </span>
            </span>
        </button>
    </div>
);


const RightSidebar = () => {
    return (
        <div className="hidden space-y-6 lg:block">
            <div className="relative p-6 bg-white rounded-lg shadow">
                 <DarkModeToggle />
                 <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">You Might Like</h4>
                    <a href="#" className="text-sm font-semibold text-blue-600">See All</a>
                 </div>
                 <hr/>
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
    );
};

export default RightSidebar;