import React from 'react';

const SidebarLink = ({ children, isNew }) => (
    <li className="flex items-center justify-between py-2">
        <a href="#" className="flex items-center space-x-3 text-gray-600 transition hover:text-blue-600">
            {children}
        </a>
        {isNew && <span className="px-2 py-0.5 text-xs font-semibold text-white bg-blue-500 rounded-full">New</span>}
    </li>
);

const SuggestedPerson = ({ name, title, imgSrc }) => (
     <div className="flex items-center justify-between py-3">
        <div className="flex items-center space-x-3">
            <img src={imgSrc} alt={name} className="w-12 h-12 rounded-full" />
            <div>
                <h4 className="font-semibold text-gray-800">{name}</h4>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
        </div>
        <a href="#" className="px-4 py-1 text-sm font-semibold text-blue-600 transition border-2 border-blue-600 rounded-full hover:bg-blue-600 hover:text-white">Connect</a>
    </div>
);

const EventCard = ({ day, month, title, attendees }) => (
    <a href="#" className="block p-1 mt-4 transition border border-transparent rounded-lg hover:border-gray-200 hover:shadow-sm">
        <div className="relative">
            <img src="/src/assets/images/feed_event1.png" alt="Event" className="rounded-lg" />
            <div className="absolute flex items-center p-2 bg-white rounded-lg left-3 top-3">
                <div className="text-center">
                    <p className="font-bold text-blue-600">{day}</p>
                    <p className="text-xs font-bold text-gray-500">{month}</p>
                </div>
                <h4 className="ml-3 text-sm font-bold text-gray-800">{title}</h4>
            </div>
        </div>
        <div className="flex items-center justify-between p-2 text-sm">
            <p className="text-gray-500">{attendees} People Going</p>
            <span className="font-semibold text-blue-600">Going</span>
        </div>
    </a>
);

const LeftSidebar = () => {
    return (
        <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow">
                <h4 className="mb-4 text-lg font-semibold text-gray-800">Explore</h4>
                <ul>
                    <SidebarLink isNew><span>{/* SVG Icon */}</span><span>Learning</span></SidebarLink>
                    <SidebarLink><span>{/* SVG Icon */}</span><span>Insights</span></SidebarLink>
                    <SidebarLink><span>{/* SVG Icon */}</span><span>Find friends</span></SidebarLink>
                    <SidebarLink><span>{/* SVG Icon */}</span><span>Bookmarks</span></SidebarLink>
                    <SidebarLink><span>{/* SVG Icon */}</span><span>Group</span></SidebarLink>
                    <SidebarLink isNew><span>{/* SVG Icon */}</span><span>Gaming</span></SidebarLink>
                    <SidebarLink><span>{/* SVG Icon */}</span><span>Settings</span></SidebarLink>
                    <SidebarLink><span>{/* SVG Icon */}</span><span>Save post</span></SidebarLink>
                </ul>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">Suggested People</h4>
                    <a href="#" className="text-sm font-semibold text-blue-600">See All</a>
                </div>
                <SuggestedPerson name="Steve Jobs" title="CEO of Apple" imgSrc="/src/assets/images/people1.png" />
                <SuggestedPerson name="Ryan Roslansky" title="CEO of Linkedin" imgSrc="/src/assets/images/people2.png" />
                <SuggestedPerson name="Dylan Field" title="CEO of Figma" imgSrc="/src/assets/images/people3.png" />
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-800">Events</h4>
                    <a href="#" className="text-sm font-semibold text-blue-600">See all</a>
                </div>
                <EventCard day="10" month="Jul" title="No more terrorism no more cry" attendees="17" />
            </div>
        </div>
    );
};

export default LeftSidebar;