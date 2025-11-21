import React from 'react';

const SidebarLink = ({ children, isNew }) => (
    <li className="flex items-center justify-between mb-4">
        <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
            {children}
        </a>
        {isNew && <span className="px-2 py-0.5 text-xs font-semibold text-white bg-blue-500 rounded-full">New</span>}
    </li>
);

const SuggestedPerson = ({ name, title, imgSrc }) => (
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
            <img src={imgSrc} alt={name} className="w-12 h-12 rounded-full" />
            <div>
                <h4 className="font-semibold text-gray-800">{name}</h4>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
        </div>
        <a href="#" className="px-4 py-1 text-sm font-semibold text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-600 hover:text-white">Connect</a>
    </div>
);

const LeftSidebar = () => {
    return (
        <div className="hidden lg:block">
            {/* Explore */}
            <div className="p-6 mb-4 bg-white rounded-lg shadow">
                <h4 className="mb-6 text-lg font-semibold text-gray-800">Explore</h4>
                <ul>
                    <SidebarLink isNew><span>SVG</span><span>Learning</span></SidebarLink>
                    <SidebarLink><span>SVG</span><span>Insights</span></SidebarLink>
                    <SidebarLink><span>SVG</span><span>Find friends</span></SidebarLink>
                </ul>
            </div>

            {/* Suggested People */}
            <div className="p-6 bg-white rounded-lg shadow">
                <h4 className="mb-6 text-lg font-semibold text-gray-800">Suggested People</h4>
                <SuggestedPerson name="Steve Jobs" title="CEO of Apple" imgSrc="/src/assets/images/people1.png" />
                <SuggestedPerson name="Ryan Roslansky" title="CEO of Linkedin" imgSrc="/src/assets/images/people2.png" />
                <SuggestedPerson name="Dylan Field" title="CEO of Figma" imgSrc="/src/assets/images/people3.png" />
            </div>
        </div>
    );
};

export default LeftSidebar;