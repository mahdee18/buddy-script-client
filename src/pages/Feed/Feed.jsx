import React from 'react';
import Navbar from '../../components/layout/Navbar';
import RightSidebar from '../../components/feed-items/RightSidebar';
import MainFeed from '../../components/feed-items/MainFeed';
import LeftSidebar from '../../components/feed-items/LeftSidebar';

const Feed = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      
      {/* Navbar at the top */}
      <Navbar/>

      {/* Main content area with padding */}
      <main className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

          <div className="lg:col-span-3">
            <LeftSidebar />
          </div>

          <div className="lg:col-span-6">
            <MainFeed /> 
          </div>

          <div className="lg:col-span-3">
            <RightSidebar />
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Feed;