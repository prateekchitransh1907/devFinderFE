import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPendingRequests, reviewRequest } from '../actions/requests'

function Requests() {
    const dispatch = useDispatch()
    const requests = useSelector((state) => state.requests.items)
    const { status, error } = useSelector((state) => state.requests.getRequests)
    const reviewById = useSelector((state) => state.requests.reviewRequest.byId)

    useEffect(() => {
        dispatch(getPendingRequests())
    }, [dispatch])

    function handleReview(requestId, reviewStatus) {
        dispatch(reviewRequest(requestId, reviewStatus))
    }

    if (status === 'pending') {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-base-200 rounded-box">
                        <div className="skeleton w-14 h-14 rounded-full shrink-0" />
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="skeleton h-4 w-36" />
                            <div className="skeleton h-3 w-56" />
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <div className="skeleton h-8 w-20 rounded-lg" />
                            <div className="skeleton h-8 w-20 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10">
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <div className="flex items-center gap-3 mb-6">
                <h1 className="text-2xl font-bold">Connection Requests</h1>
                {requests.length > 0 && (
                    <span className="badge badge-primary badge-lg">{requests.length}</span>
                )}
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-16 text-base-content/50">
                    <p className="text-lg">No pending requests.</p>
                    <p className="text-sm mt-1">You&apos;re all caught up!</p>
                </div>
            ) : (
                <ul className="flex flex-col gap-4">
                    {requests.map((request) => {
                        // The sender is in senderId (populated) or fromUserId fallback
                        const sender = request.senderId ?? request.fromUserId ?? request
                        const fullName = `${sender.firstName || ''} ${sender.lastName || ''}`.trim() || sender.emailId
                        const initials = (sender.firstName?.charAt(0) || '?').toUpperCase()
                        const reviewState = reviewById[request._id]
                        const isLoading = reviewState?.status === 'pending'
                        const reviewError = reviewState?.error

                        return (
                            <li
                                key={request._id}
                                className="flex items-center gap-4 p-4 bg-base-200 rounded-box shadow-sm"
                            >
                                <div className="avatar shrink-0">
                                    <div className="w-14 rounded-full">
                                        {sender.photoUrl ? (
                                            <img src={sender.photoUrl} alt={fullName} referrerPolicy="no-referrer" />
                                        ) : (
                                            <div className="bg-primary text-primary-content w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold">
                                                {initials}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">{fullName}</p>
                                    {sender.about && (
                                        <p className="text-sm text-base-content/60 truncate">{sender.about}</p>
                                    )}
                                    {sender.skills?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {sender.skills.slice(0, 4).map((skill) => (
                                                <span key={skill} className="badge badge-outline badge-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                            {sender.skills.length > 4 && (
                                                <span className="badge badge-ghost badge-sm">+{sender.skills.length - 4}</span>
                                            )}
                                        </div>
                                    )}
                                    {reviewError && (
                                        <p className="text-xs text-error mt-1">{reviewError}</p>
                                    )}
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    <button
                                        type="button"
                                        className="btn btn-success btn-sm"
                                        disabled={isLoading}
                                        onClick={() => handleReview(request._id, 'accepted')}
                                    >
                                        {isLoading ? <span className="loading loading-spinner loading-xs" /> : 'Accept'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-error btn-sm btn-outline"
                                        disabled={isLoading}
                                        onClick={() => handleReview(request._id, 'rejected')}
                                    >
                                        {isLoading ? <span className="loading loading-spinner loading-xs" /> : 'Reject'}
                                    </button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default Requests