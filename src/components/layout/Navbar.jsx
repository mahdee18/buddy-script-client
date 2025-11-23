import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import profilePic from '../../assets/images/profile.png';
import notificationAvatar from '../../assets/images/friend-req.png';

const NotificationDropdown = () => (
    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-700">
        <div className="p-4 border-b border-gray-700">
            <h4 className="text-lg font-semibold text-gray-800 ">Notifications</h4>
        </div>
        <div className="p-2 border-b border-gray-700">
            <button className="px-4 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full">All</button>
            <button className="px-4 py-1 ml-2 text-sm font-semibold text-gray-600 bg-gray-200   rounded-full">Unread</button>
        </div>
        <div className="max-h-80 overflow-y-auto">
            <div className="flex items-start p-4 space-x-3 transition hover:bg-gray-50 ">
                <img src={notificationAvatar} alt="Steve Jobs" className="w-10 h-10 rounded-full" />
                <div>
                    <p className="text-sm text-gray-700 "><strong className="font-bold text-gray-900">Steve Jobs</strong> posted a link.</p>
                    <span className="text-xs text-blue-500">42 minutes ago</span>
                </div>
            </div>
        </div>
    </div>
);

const Navbar = () => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    return (
        <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-700">
            <nav className="hidden py-2 lg:block">
                <div className="container px-4 mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <Link to="/feed"><img src={logo} alt="Buddy Script" className="h-8" /></Link>
                            <div className="relative">
                                <input type="search" placeholder="Search..." className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border-transparent rounded-lg text-gray-800 focus:outline-none focus:bg-gray-200" />
                                <svg className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 top-1/2 left-3" fill="none" viewBox="0 0 17 17"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M16 16l-4-4" /></svg>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <button onMouseEnter={() => setIsNotificationOpen(true)} onMouseLeave={() => setIsNotificationOpen(false)} className="relative p-2 rounded-full hover:bg-gray-100 hover:bg-gray-700">
                                    <svg className="w-6 h-6 text-gray-600 " fill="currentColor" viewBox="0 0 20 22"><path d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd"></path></svg>
                                    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">6</span>
                                    {isNotificationOpen && <NotificationDropdown />}
                                </button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <img src={profilePic} alt="Dylan Field" className="w-10 h-10 rounded-full" />
                                <div className="hidden text-sm font-semibold text-gray-700  lg:block">Dylan Field</div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="flex items-center justify-between p-4 lg:hidden">
                <Link to="/feed"><img src={logo} alt="Buddy Script" className="h-7" /></Link>
                <button className="p-2 text-gray-600 "><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>
            </div>
        </header>
    );
};
export default Navbar;