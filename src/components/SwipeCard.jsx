import { useRef, useState } from 'react'

const SWIPE_THRESHOLD = 80

function SwipeCard({ user, onSwipeLeft, onSwipeRight, stackIndex, onClick }) {
    const cardRef = useRef(null)
    const [drag, setDrag] = useState({ active: false, startX: 0, x: 0 })
    const [leaving, setLeaving] = useState(null) // 'left' | 'right' | null

    const isTop = stackIndex === 0
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Developer'
    const initials = (user.firstName?.charAt(0) || '?').toUpperCase()

    function computeTransform() {
        if (leaving === 'right') return 'translateX(160vw) rotate(25deg)'
        if (leaving === 'left') return 'translateX(-160vw) rotate(-25deg)'
        if (isTop && drag.active) {
            return `translateX(${drag.x}px) rotate(${drag.x / 15}deg)`
        }
        return `translateY(${stackIndex * 14}px) scale(${1 - stackIndex * 0.05})`
    }

    function onPointerDown(e) {
        if (!isTop) return
        cardRef.current.setPointerCapture(e.pointerId)
        setDrag({ active: true, startX: e.clientX, x: 0 })
    }

    function onPointerMove(e) {
        if (!drag.active) return
        setDrag(prev => ({ ...prev, x: e.clientX - prev.startX }))
    }

    function onPointerUp() {
        if (!drag.active) return
        if (drag.x > SWIPE_THRESHOLD) {
            setLeaving('right')
            setTimeout(onSwipeRight, 380)
            setDrag({ active: false, startX: 0, x: drag.x })
        } else if (drag.x < -SWIPE_THRESHOLD) {
            setLeaving('left')
            setTimeout(onSwipeLeft, 380)
            setDrag({ active: false, startX: 0, x: drag.x })
        } else {
            // Tap (no meaningful drag) — open detail panel
            if (Math.abs(drag.x) < 8 && isTop && onClick) onClick(user)
            setDrag({ active: false, startX: 0, x: 0 })
        }
    }

    const overlayOpacity = Math.min(Math.abs(drag.x) / SWIPE_THRESHOLD, 1)
    const showLike = drag.x > 20
    const showNope = drag.x < -20

    return (
        <div
            ref={cardRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => setDrag({ active: false, startX: 0, x: 0 })}
            style={{
                transform: computeTransform(),
                transition: drag.active ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                zIndex: 10 - stackIndex,
                cursor: isTop ? (drag.active ? 'grabbing' : 'grab') : 'default',
                userSelect: 'none',
                touchAction: 'none',
                position: 'absolute',
                inset: 0,
            }}
        >
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-base-300">
                {/* Photo */}
                {user.photoUrl ? (
                    <img
                        src={user.photoUrl}
                        alt={fullName}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable={false}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/40 flex items-center justify-center">
                        <span className="text-9xl font-bold text-white/30 select-none">{initials}</span>
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* LIKE stamp */}
                {showLike && (
                    <div
                        className="absolute top-10 left-6 border-4 border-success text-success font-black text-3xl px-4 py-1 rounded-xl tracking-widest rotate-[-15deg]"
                        style={{ opacity: overlayOpacity }}
                    >
                        LIKE 💚
                    </div>
                )}

                {/* NOPE stamp */}
                {showNope && (
                    <div
                        className="absolute top-10 right-6 border-4 border-error text-error font-black text-3xl px-4 py-1 rounded-xl tracking-widest rotate-[15deg]"
                        style={{ opacity: overlayOpacity }}
                    >
                        NOPE ❌
                    </div>
                )}

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-end gap-2 mb-2">
                        <h2 className="text-2xl font-bold leading-tight">{fullName}</h2>
                        {user.age && <span className="text-xl font-light mb-0.5 text-white/80">{user.age}</span>}
                    </div>
                    {user.about && (
                        <p className="text-sm text-white/75 line-clamp-2 mb-3 leading-relaxed">{user.about}</p>
                    )}
                    {user.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {user.skills.slice(0, 5).map(skill => (
                                <span
                                    key={skill}
                                    className="text-xs px-2.5 py-0.5 rounded-full font-medium border"
                                    style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}
                                >
                                    {skill}
                                </span>
                            ))}
                            {user.skills.length > 5 && (
                                <span
                                    className="text-xs px-2.5 py-0.5 rounded-full font-medium border"
                                    style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}
                                >
                                    +{user.skills.length - 5} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SwipeCard
