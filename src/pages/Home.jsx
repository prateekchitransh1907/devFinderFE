import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFeed } from '../actions/feed'
import { sendRequest } from '../actions/sendRequest'
import SwipeCard from '../components/SwipeCard'
import UserDetailPanel from '../components/UserDetailPanel'
//import { getPremiumVerifyStatus } from '../actions/payments'

function Home() {
    const dispatch = useDispatch()
    const feedItems = useSelector((state) => state.feed.items)
    const { status, error } = useSelector((state) => state.feed.getFeed)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedUser, setSelectedUser] = useState(null)

    useEffect(() => {
        dispatch(getFeed())
        //dispatch(getPremiumVerifyStatus())
    }, [dispatch])

    useEffect(() => {
        setCurrentIndex(0)
    }, [feedItems])

    const advance = () => { setCurrentIndex(prev => prev + 1); setSelectedUser(null) }
    const remaining = feedItems.slice(currentIndex)

    function handleIgnore(user) {
        dispatch(sendRequest('ignored', user._id))
        advance()
    }

    function handleInterested(user) {
        dispatch(sendRequest('interested', user._id))
        advance()
    }

    if (status === 'pending') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
                <span className="loading loading-spinner loading-lg text-primary" />
                <p className="text-base-content/40 text-sm">Finding developers for you...</p>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="max-w-md mx-auto px-4 py-10">
                <div role="alert" className="alert alert-error">
                    <span>⚠️ {error}</span>
                    <button className="btn btn-sm btn-ghost" onClick={() => dispatch(getFeed())}>Retry</button>
                </div>
            </div>
        )
    }

    if (remaining.length === 0 && status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3 text-base-content/40">
                <span className="text-6xl">🎉</span>
                <p className="text-xl font-semibold">You've seen everyone!</p>
                <p className="text-sm">Check back later for new developers</p>
                <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={() => { dispatch(getFeed()); setCurrentIndex(0) }}
                >
                    Refresh Feed
                </button>
            </div>
        )
    }

    const visibleCards = remaining.slice(0, 3)

    return (
        <div className={`flex items-start justify-center min-h-[calc(100vh-64px)] px-4 py-6 gap-8 transition-all duration-300 ${selectedUser ? 'max-w-4xl mx-auto' : ''}`}>
            {/* Left: card stack + buttons */}
            <div className="flex flex-col items-center gap-8">
                <div className="relative w-full max-w-sm" style={{ height: '560px', width: '360px' }}>
                    {[...visibleCards].reverse().map((user, reversedIdx) => {
                        const stackIndex = visibleCards.length - 1 - reversedIdx
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

                {/* Action buttons */}
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => handleIgnore(remaining[0])}
                        className="btn btn-circle btn-lg border-2 border-error text-error bg-base-100 hover:bg-error hover:text-white shadow-lg hover:scale-110 transition-transform"
                        title="Pass"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <button
                        onClick={() => handleInterested(remaining[0])}
                        className="btn btn-circle btn-lg border-2 border-success text-success bg-base-100 hover:bg-success hover:text-white shadow-lg hover:scale-110 transition-transform"
                        title="Connect"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>

                <p className="text-xs text-base-content/30">{remaining.length} developer{remaining.length !== 1 ? 's' : ''} left</p>
            </div>

            {/* Right: detail panel */}
            {selectedUser && (
                <div className="flex-1 self-stretch" style={{ minWidth: 0, maxWidth: '380px' }}>
                    <UserDetailPanel user={selectedUser} onClose={() => setSelectedUser(null)} />
                </div>
            )}
        </div>
    )
}

export default Home
