import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile, editProfile } from '../actions/profile'
import { resetEditProfile } from '../reducers/profile/profileSlice'

function Profile() {
    const dispatch = useDispatch()
    const profileData = useSelector((state) => state.profile.data)
    const { status, error } = useSelector((state) => state.profile.getProfile)
    const { status: editStatus, error: editError } = useSelector((state) => state.profile.editProfile)
    const { isPremium, membershipType } = useSelector(
        (state) => state.payments.premiumVerify
    );
    const [toast, setToast] = useState(null) // { type: 'success'|'error', message }

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        emailId: '',
        age: '',
        about: '',
        photoUrl: '',
        skills: [],
    })
    const [saved, setSaved] = useState(false)
    const [showPhotoInput, setShowPhotoInput] = useState(false)

    useEffect(() => {
        if (!toast) return undefined
        const timer = setTimeout(() => setToast(null), 4000)
        return () => clearTimeout(timer)
    }, [toast])

    useEffect(() => {
        dispatch(getProfile())
    }, [dispatch])

    useEffect(() => {
        if (!profileData) return
        setForm({
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            emailId: profileData.emailId || '',
            age: profileData.age ?? '',
            about: profileData.about || '',
            photoUrl: profileData.photoUrl || '',
            skills: profileData.skills || [],
        })
    }, [profileData])

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        setSaved(false)
    }

    function toggleSkill(skill) {
        setForm(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill],
        }))
        setSaved(false)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const result = await dispatch(editProfile({
            photoUrl: form.photoUrl,
            skills: form.skills,
            about: form.about,
        }))
        if (result.success) {
            setSaved(true)
            setToast({ type: 'success', message: result.message || 'Profile updated!' })
        } else {
            setToast({ type: 'error', message: result.error })
        }
        dispatch(resetEditProfile())
    }

    const fullName = `${form.firstName} ${form.lastName}`.trim()

    if (status === 'pending') {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">
                <div className="skeleton h-8 w-48" />
                <div className="flex items-center gap-4">
                    <div className="skeleton w-16 h-16 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <div className="skeleton h-4 w-36" />
                        <div className="skeleton h-3 w-48" />
                    </div>
                </div>
                <div className="skeleton h-12 w-full" />
                <div className="skeleton h-12 w-full" />
                <div className="skeleton h-28 w-full" />
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10">
                <div role="alert" className="alert alert-error">
                    <span>⚠️ {error}</span>
                    <button className="btn btn-sm btn-ghost" onClick={() => dispatch(getProfile())}>Retry</button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            {toast && (
                <div className="toast toast-top toast-end z-50">
                    <div role="alert" className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`}>
                        <span>{toast.type === 'success' ? '✅' : '⚠️'} {toast.message}</span>
                        <button type="button" className="btn btn-ghost btn-xs" onClick={() => setToast(null)}>✖</button>
                    </div>
                </div>
            )}
            <h1 className="text-3xl font-bold mb-1">My Profile</h1>
            <p className="text-base-content/50 text-sm mb-8">Manage your developer profile</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* Profile Picture */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-5">
                        <div className="relative group cursor-pointer" onClick={() => setShowPhotoInput(p => !p)}>
                            <div className="avatar">
                                <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    {form.photoUrl ? (
                                        <img src={form.photoUrl} alt={fullName} referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="bg-primary text-primary-content w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold">
                                            {form.firstName.charAt(0).toUpperCase() || '?'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 112.828 2.828L11.828 13.828A2 2 0 0110.414 14H8v-2.414A2 2 0 018.586 10L9 11z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-lg">
                                    {fullName || "Your Name"}
                                </p>

                                {isPremium && (
                                    <div
                                        className={`badge badge-sm font-semibold ${membershipType === "gold"
                                            ? "badge-warning"
                                            : "badge-primary"
                                            }`}
                                    >
                                        {membershipType === "gold" ? "⭐ GOLD member" : "⚡ PRO member"}
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-base-content/50">{form.emailId || 'your@email.com'}</p>
                            {form.age && <p className="text-sm text-base-content/40">Age {form.age}</p>}
                            <button type="button" className="text-xs text-primary/70 mt-1 hover:underline" onClick={() => setShowPhotoInput(p => !p)}>
                                {showPhotoInput ? 'Cancel' : 'Change photo URL'}
                            </button>
                        </div>
                    </div>
                    {showPhotoInput && (
                        <div className="flex gap-2 items-center">
                            <input
                                type="url"
                                name="photoUrl"
                                placeholder="https://example.com/photo.jpg"
                                className="input input-bordered input-sm flex-1"
                                value={form.photoUrl}
                                onChange={handleChange}
                                autoFocus
                            />
                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowPhotoInput(false)}>Done</button>
                        </div>
                    )}
                </div>

                <div className="divider my-0" />

                {/* About */}
                <label className="form-control w-full">
                    <div className="label"><span className="label-text">About</span></div>
                    <textarea
                        name="about"
                        placeholder="Tell other developers about yourself..."
                        className="textarea textarea-bordered w-full h-28 resize-none"
                        value={form.about}
                        onChange={handleChange}
                        maxLength={500}
                    />
                    <div className="label">
                        <span className="label-text-alt text-base-content/40">{form.about.length}/500</span>
                    </div>
                </label>

                {/* Skills — free-form chips from API + toggle */}
                <div className="form-control w-full">
                    <div className="label"><span className="label-text">Skills</span></div>
                    <div className="flex flex-wrap gap-2">
                        {form.skills.map(skill => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => toggleSkill(skill)}
                                className="badge badge-lg badge-primary cursor-pointer border transition-colors"
                            >
                                {skill} ✕
                            </button>
                        ))}
                    </div>
                    {form.skills.length === 0 && (
                        <p className="text-xs text-base-content/40 mt-2">No skills added yet.</p>
                    )}
                </div>

                {/* Submit */}
                <div className="flex items-center gap-3 pt-2">
                    <button type="submit" className="btn btn-primary" disabled={editStatus === 'pending'}>
                        {editStatus === 'pending' ? (
                            <span className="inline-flex items-center gap-2">
                                <span className="loading loading-spinner loading-sm" />
                                Saving...
                            </span>
                        ) : 'Save Profile'}
                    </button>
                </div>

            </form>
        </div>
    )
}

export default Profile
