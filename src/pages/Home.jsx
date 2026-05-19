import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { getFeed } from '../actions/feed';
import { sendRequest } from '../actions/sendRequest';
import SwipeCard from '../components/SwipeCard';

function Home() {
    const dispatch = useDispatch();
    const feedItems = useSelector((state) => state.feed.items);
    const { status, error } = useSelector((state) => state.feed.getFeed);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => [
        dispatch(getFeed())
    ], [dispatch]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [feedItems]);

    const advance = () => { setCurrentIndex(prev => prev + 1); setSelectedUser(null) }
    const remaining = feedItems.slice(currentIndex);

    function handleIgnore(user) {
        dispatch(sendRequest('ignored', user._id));
        advance();
    }

    function handleInterested(user) {
        dispatch(sendRequest('interested', user._id));
        advance();
    }

    if (status === 'pending') {
        return (
            <div className='flex flex-col items-center justify-center min-h-[80vh] gap-4'>
                <span className='loading loading-spinner loading-lg text-primary' />
                <p className='text-base-content/40 text-sm'>Finding developers for you...</p>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className='max-w-md mx-auto px-4 py-10'>
                <div role="alert" className='alert alert-error'>
                    <span>
                        ☹️ {error || 'Something went wrong while fetching your feed.'}
                    </span>
                    <button className="btn btn-sm btn-ghost" onClick={() => dispatch(getFeed())}>
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    if (remaining.length === 0 && status === 'success') {
        return (
            <div className='flex flex-col items-center justify-center min-h-[80vh] gap-4'>
                <span className='text-6xl'>🎉</span>
                <p className="text-xl font-semibold">You've seen everyone!</p>
                <p className='text-sm'>Check back later for new developers</p>
                <button
                    className='btn btn-primary btn-sm mt-2'
                    onClick={() => { dispatch(getFeed()); setCurrentIndex(0) }}
                >
                    Refresh Feed
                </button>
            </div>
        )
    }

    const visibleCards = remaining.slice(0, 3);

    return (
        <div className={`flex items-start jusify-center min-h-[calc(100vh-64px)] px-4 py-6 gap-8 transition-all duration-300 ${selectedUser ? 'max-w-4xl mx-auto' : ''}`}>
            {/* Left: card stack + buttons */}
            <div className='flex flex-col items-center gap-8'>
                <div className='relative w-full max-w-sm' style={{ height: '560px', width: '360px' }}>
                    {[...visibleCards].reverse().map((user, i) => {
                        const stackIndex = visibleCards.length - 1 - i;
                        return (
                            <SwipeCard
                                key={user._id || user.emailId}
                                user={user}
                                stackIndex={stackIndex}
                                onSwipeLeft={() => handleIgnore(user)}
                                onSwipeRight={() => handleInterested(user)}
                                onClick={setSelectedUser}
                            />
                        )

                    })}

                </div>

            </div>
        </div>
    );
}

export default Home;