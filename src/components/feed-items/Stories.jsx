const YourStoryCard = () => (
    <div className="relative flex-shrink-0 w-1/4 h-48 overflow-hidden rounded-lg shadow-md md:w-1/5 lg:w-1/4">
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
    <div className="relative flex-shrink-0 w-1/4 h-48 overflow-hidden rounded-lg shadow-md md:w-1/5 lg:w-1/4">
        <img src={storyImg} alt={name} className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <img src={avatarImg} alt={name} className="absolute w-10 h-10 border-4 border-blue-600 rounded-full top-3 left-3" />
        <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white truncate">{name}</p>
    </div>
);
const Stories = () => {
    return (
        <div className="mb-6 bg-white rounded-lg shadow">
            <div className="flex p-4 space-x-3 overflow-x-auto">
                <YourStoryCard />
                <StoryCard name="Ryan Roslansky" storyImg="/src/assets/images/card_ppl2.png" avatarImg="/src/assets/images/mini_pic.png" />
                <StoryCard name="A Begum" storyImg="/src/assets/images/card_ppl3.png" avatarImg="/src/assets/images/mini_pic.png" />
                <StoryCard name="John Doe" storyImg="/src/assets/images/card_ppl4.png" avatarImg="/src/assets/images/mini_pic.png" />

            </div>
        </div>
    );
};
export default Stories;