import React, { useRef } from 'react';

const YourStoryCard = () => (
    <div className="relative flex-shrink-0 w-28 h-48 overflow-hidden rounded-lg shadow-md">
        <img src="/src/assets/images/card_ppl1.png" alt="Your Story" className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute bottom-0 left-0 right-0 p-2 text-center text-white">
            <button className="flex items-center justify-center w-8 h-8 mx-auto mb-1 bg-blue-600 border-2 border-white rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </button>
            <p className="text-xs font-semibold">Your Story</p>
        </div>
    </div>
);

const StoryCard = ({ name, storyImg, avatarImg }) => (
    <div className="relative flex-shrink-0 w-28 h-48 overflow-hidden rounded-lg shadow-md">
        <img src={storyImg} alt={name} className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <img src={avatarImg} alt={name} className="absolute w-10 h-10 border-4 border-blue-600 rounded-full top-3 left-3" />
        <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white truncate">{name}</p>
    </div>
);

const Stories = () => {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="relative mb-6 bg-white rounded-lg shadow">
            <div
                ref={scrollContainerRef}
                className="flex p-4 space-x-3 overflow-x-auto no-scrollbar"
            >
                <YourStoryCard />
                <StoryCard name="Ryan Roslansky" storyImg="/src/assets/images/card_ppl2.png" avatarImg="/src/assets/images/mini_pic.png" />
                <StoryCard name="A Begum" storyImg="/src/assets/images/card_ppl3.png" avatarImg="/src/assets/images/mini_pic.png" />
                <StoryCard name="John Doe" storyImg="/src/assets/images/card_ppl4.png" avatarImg="/src/assets/images/mini_pic.png" />
                <StoryCard name="Jane Smith" storyImg="/src/assets/images/card_ppl2.png" avatarImg="/src/assets/images/mini_pic.png" />
                <StoryCard name="Peter Jones" storyImg="/src/assets/images/card_ppl3.png" avatarImg="/src/assets/images/mini_pic.png" />
                <StoryCard name="Elon Musk" storyImg="/src/assets/images/card_ppl4.png" avatarImg="/src/assets/images/mini_pic.png" />
            </div>

            <button
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
    );
};

export default Stories;