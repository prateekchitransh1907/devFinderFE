import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getConnections } from '../actions/connections'
import { useNavigate } from 'react-router-dom'

function Connections() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const connections = useSelector((state) => state.connections.items)
    const { status, error } = useSelector((state) => state.connections.getConnections)
    const [messagedIds, setMessagedIds] = useState(new Set())

    useEffect(() => {
        dispatch(getConnections())
    }, [dispatch])

    function handleMessage(user) {
        navigate(`/chat/${user._id}`, {
            state: {
                user,
            },
        });
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
                        <div className="skeleton h-8 w-24 rounded-lg shrink-0" />
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
                <h1 className="text-2xl font-bold">My Connections</h1>
                {connections.length > 0 && (
                    <span className="badge badge-primary badge-lg w-8 h-8 rounded-full flex items-center justify-center">{connections.length}</span>
                )}
            </div>

            {connections.length === 0 ? (
                <div className="text-center py-16 text-base-content/50">
                    <p className="text-lg">No connections yet.</p>
                    <p className="text-sm mt-1">Start swiping to connect with developers!</p>
                </div>
            ) : (
                <ul className="flex flex-col gap-4">
                    {connections.map((user) => {
                        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailId
                        const initials = (user.firstName?.charAt(0) || '?').toUpperCase()
                        const hasMessaged = messagedIds.has(user._id)

                        return (
                            <li
                                key={user._id}
                                className="flex items-center gap-4 p-4 bg-base-200 rounded-box shadow-sm"
                            >
                                <div className="avatar shrink-0">
                                    <div className="w-14 rounded-full">
                                        {user.photoUrl ? (
                                            <img src={user.photoUrl} alt={fullName} referrerPolicy="no-referrer" />
                                        ) : (
                                            <div className="bg-primary text-primary-content w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold">
                                                {initials}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">{fullName}</p>
                                    {user.about && (
                                        <p className="text-sm text-base-content/60 truncate">{user.about}</p>
                                    )}
                                    {user.skills?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {user.skills.slice(0, 4).map((skill) => (
                                                <span key={skill} className="badge badge-outline badge-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                            {user.skills.length > 4 && (
                                                <span className="badge badge-ghost badge-sm">+{user.skills.length - 4}</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    disabled={hasMessaged}
                                    onClick={() => handleMessage(user)}
                                    className={`btn btn-sm shrink-0 ${hasMessaged ? 'btn-disabled' : 'btn-primary'}`}
                                >
                                    {hasMessaged ? 'Messaged' : 'Message'}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default Connections
