function UserDetailPanel({ user, onClose }) {
    if (!user) return null;

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Developer";
    const initials = (user.firstName?.charAt(0) || "?").toUpperCase();

    return (
        <div className="flex flex-col h-full bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden animate slide-in">
            {/* Header photo */}
            <div className="relative h-56 shrink-0 bg-base-300">
                {user.photoUrl ? (
                    <img
                        src={user.photoUrl}
                        alt={fullName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/40 flex items-center justify-center">
                        <span className="text-8xl font-bold text-white/30 select-none">{initials}</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Close button */}
                <button
                    type="button"
                    className="absolute top-3 right-3 btn btn-circle btn-sm bg-black/40 border-0 text-white hover:bg-black/60"
                    onClick={onClose}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                        onClick={onclose}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Name overlay */}
                <div className="absolute bottom-4 left-5 text-white">
                    <h2 className="text-2xl font-bold leading-tight">{fullName}</h2>
                    {user.age && (
                        <p className="text-sm text-white/70">
                            {user.age} years old
                        </p>
                    )}
                </div>

                {/* Scrollable details */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">

                    {/* Name fields */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-base-200 rounded-xl p-3">
                            <p className="text-xs text-base-content/40 uppercase tracking-wide mb-0.5">First Name</p>
                            <p className="font-semibold">{user.firstName || ''}</p>
                        </div>
                        <div className="bg-base-200 rounded-xl p-3">
                            <p className="text-xs text-base-content/40 uppercase tracking-wide mb-0.5">First Name</p>
                            <p className="font-semibold">{user.lastName || ''}</p>
                        </div>
                    </div>

                    {/* Age */}
                    {user.age && (
                        <div className="bg-base-200 rounded-xl p-3">
                            <p className="text-xs text-base-content/40 uppercase tracking-wide mb-0.5">Age</p>
                            <p className="font-semibold">{user.age}</p>
                        </div>
                    )}

                    {/* About */}
                    {user.about && (
                        <div className="bg-base-200 rounded-xl p-3">
                            <p className="text-xs text-base-content/40 uppercase tracking-wide mb-1">About</p>
                            <p className="text-sm text-base-content/80 leading-relaxed">{user.about}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {user.skills?.length > 0 && (
                        <div>
                            <p className="text-xs text-base-content/40 uppercase tracking-wide mb-2">Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="badge badge-primary badge-outline"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserDetailPanel;