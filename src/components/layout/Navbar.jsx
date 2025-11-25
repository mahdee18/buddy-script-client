import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/images/logo.svg';
import notificationAvatar from '../../assets/images/friend-req.png';

// Import icons from react-icons
import { HiOutlineHome, HiOutlineUsers, HiOutlineBell, HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import { FiChevronDown, FiChevronRight, FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick';

// ===================================================================
// SUB-COMPONENT 1: Profile Dropdown Menu
// ===================================================================
const ProfileDropdown = ({ user, menuRef }) => {
    const { logOut } = useAuth();

    const MenuItem = ({ icon, text, hasArrow = true, onClick }) => (
        <button onClick={onClick} className="flex items-center justify-between w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
            <div className="flex items-center gap-3">
                <span className="p-2 bg-gray-100 rounded-full">{icon}</span>
                <span className="font-semibold">{text}</span>
            </div>
            {hasArrow && <FiChevronRight className="w-5 h-5 text-gray-400" />}
        </button>
    );

    return (
        <div
            ref={menuRef}
            className="absolute right-0 z-20 w-72 mt-2 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
        >
            <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                    <img src={user?.profilePicture || '/images/profile.png'} alt="Your avatar" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                        <h4 className="font-bold text-gray-800">{user?.firstName} {user?.lastName}</h4>
                        <Link to="/profile" className="text-sm text-blue-600 hover:underline">View Profile</Link>
                    </div>
                </div>
            </div>
            <div className="py-2">
                <MenuItem icon={<FiSettings size={20} />} text="Settings" />
                <MenuItem icon={<FiHelpCircle size={20} />} text="Help & Support" />
                <MenuItem icon={<FiLogOut size={20} />} text="Log Out" onClick={logOut} />
            </div>
        </div>
    );
};

// ===================================================================
// SUB-COMPONENT 2: Notification Dropdown
// ===================================================================
const NotificationDropdown = ({ menuRef }) => (
    <div ref={menuRef} className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden border">
        <div className="p-4 border-b">
            <h4 className="text-lg font-semibold text-gray-800">Notifications</h4>
        </div>
        <div className="p-2 border-b bg-gray-50">
            <button className="px-4 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full">All</button>
            <button className="px-4 py-1 ml-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-full">Unread</button>
        </div>
        <div className="max-h-80 overflow-y-auto">
            <div className="flex items-start p-4 space-x-3 transition hover:bg-gray-100">
                <img src={notificationAvatar} alt="Notification avatar" className="w-10 h-10 rounded-full" />
                <div>
                    <p className="text-sm text-gray-700"><strong className="font-bold text-gray-900">Steve Jobs</strong> posted a new photo.</p>
                    <span className="text-xs text-blue-500">42 minutes ago</span>
                </div>
            </div>
             <div className="flex items-start p-4 space-x-3 transition hover:bg-gray-100">
                <img src={notificationAvatar} alt="Notification avatar" className="w-10 h-10 rounded-full" />
                <div>
                    <p className="text-sm text-gray-700"><strong className="font-bold text-gray-900">Elon Musk</strong> commented on your post.</p>
                    <span className="text-xs text-blue-500">1 hour ago</span>
                </div>
            </div>
        </div>
    </div>
);

// ===================================================================
// MAIN NAVBAR COMPONENT
// ===================================================================
const Navbar = () => {
    const { user } = useAuth();
    const [isProfileOpen, setIsProfileOpen, profileMenuRef] = useDetectOutsideClick(false);
    const [isNotificationOpen, setIsNotificationOpen, notificationMenuRef] = useDetectOutsideClick(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close Profile Menu
            const profileButton = event.target.closest('[data-menu-button="profile"]');
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target) && !profileButton) {
                setIsProfileOpen(false);
            }
            // Close Notification Menu
            const notificationButton = event.target.closest('[data-menu-button="notification"]');
            if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target) && !notificationButton) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const NavIconButton = ({ icon, badgeCount, onClick, menuButtonId }) => (
        <button onClick={onClick} data-menu-button={menuButtonId} className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
            {icon}
            {badgeCount > 0 && (
                 <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-blue-600 rounded-full">
                    {badgeCount}
                </span>
            )}
        </button>
    );

    return (
        <header className="sticky top-0 z-40 bg-white shadow-sm">
            <nav className="hidden py-2 lg:block">
                <div className="container px-4 mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <Link to="/feed">
                                <img src={logo} alt="Buddy Script" className="h-8" />
                            </Link>
                            <div className="relative">
                                <IoSearchOutline className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 top-1/2 left-3" />
                                <input type="search" placeholder="input search text" className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border-transparent rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Link to="/feed" className="p-3 rounded-md text-blue-600 bg-blue-50 border-b-2 border-blue-600">
                                <HiOutlineHome size={24} />
                            </Link>
                            <Link to="#" className="p-3 rounded-md text-gray-600 hover:bg-gray-100">
                                <HiOutlineUsers size={24} />
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <NavIconButton icon={<HiOutlineBell size={24} />} badgeCount={2} onClick={() => setIsNotificationOpen(!isNotificationOpen)} menuButtonId="notification" />
                                    {isNotificationOpen && <NotificationDropdown menuRef={notificationMenuRef} />}
                                </div>
                                <NavIconButton icon={<HiOutlineChatBubbleOvalLeft size={24} />} badgeCount={6} />
                            </div>
                            
                            <div className="relative">
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)} data-menu-button="profile" className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                    <img src={user?.profilePicture || '/images/profile.png'} alt="Your avatar" className="w-9 h-9 rounded-full object-cover" />
                                    <div className="hidden text-sm font-semibold text-gray-700 lg:block">{user?.firstName} {user?.lastName}</div>
                                    <FiChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isProfileOpen && <ProfileDropdown user={user} menuRef={profileMenuRef} />}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex items-center justify-between p-4 lg:hidden">
                <Link to="/feed"><img src={logo} alt="Buddy Script" className="h-7" /></Link>
            </div>
        </header>
    );
};

export default Navbar;