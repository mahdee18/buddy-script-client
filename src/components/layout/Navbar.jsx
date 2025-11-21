import React from 'react';
import { Link } from 'react-router-dom';

// Import assets
import logo from '../../assets/images/logo.svg';
import profilePic from '../../assets/images/profile.png';

const SearchIcon = () => <svg className="absolute w-4 h-4 text-gray-400 left-3" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17"><circle cx="7" cy="7" r="6" stroke="currentColor" /><path stroke="currentColor" strokeLinecap="round" d="M16 16l-3-3" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" fill="none" viewBox="0 0 18 21"><path stroke="#377DFF" strokeWidth="1.5" d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z" /><path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857" /></svg>;
// ... Add other SVG icons for notifications, friends, chat etc. as needed

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 py-2 bg-white shadow-sm">
            <div className="container px-4 mx-auto">
                <div className="flex items-center justify-between">
                    {/* Logo and Search */}
                    <div className="flex items-center space-x-8">
                        <Link to="/feed">
                            <img src={logo} alt="Buddy Script" className="h-8" />
                        </Link>
                        <div className="relative hidden md:block">
                            <SearchIcon />
                            <input
                                type="search"
                                placeholder="input search text"
                                className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-gray-300"
                            />
                        </div>
                    </div>

                    {/* Nav Icons and Profile */}
                    <div className="flex items-center space-x-6">
                        <ul className="items-center hidden space-x-6 md:flex">
                            <li><Link to="/feed" className="text-blue-500"><HomeIcon /></Link></li>
                            {/* Add other icons here */}
                        </ul>

                        {/* Profile Dropdown */}
                        <div className="flex items-center space-x-2">
                            <img src={profilePic} alt="Dylan Field" className="w-10 h-10 rounded-full" />
                            <div className="hidden text-sm font-semibold text-gray-700 lg:block">Dylan Field</div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;