import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, editProfile } from "../actions/profile";
import { resetEditProfile } from "../reducers/profile/profileSlice";
import ProfilePhotoUploader from "../components/ProfilePhotoUploader";

function Profile() {
    const dispatch = useDispatch();

    const profileData = useSelector((state) => state.profile.data);

    const { status, error } = useSelector(
        (state) => state.profile.getProfile
    );

    const {
        status: editStatus,
    } = useSelector((state) => state.profile.editProfile);

    const { isPremium, membershipType } = useSelector(
        (state) => state.payments.premiumVerify
    );

    const [toast, setToast] = useState(null);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        emailId: "",
        age: "",
        about: "",
        photoUrl: "",
        skills: [],
    });

    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => setToast(null), 4000);

        return () => clearTimeout(timer);
    }, [toast]);

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    useEffect(() => {
        if (!profileData) return;

        setForm({
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            emailId: profileData.emailId || "",
            age: profileData.age ?? "",
            about: profileData.about || "",
            photoUrl: profileData.photoUrl || "",
            skills: profileData.skills || [],
        });
    }, [profileData]);

    function handleChange(e) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function toggleSkill(skill) {
        setForm((prev) => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter((s) => s !== skill)
                : [...prev.skills, skill],
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const result = await dispatch(
            editProfile({
                photoUrl: form.photoUrl,
                about: form.about,
                skills: form.skills,
            })
        );

        if (result.success) {
            setToast({
                type: "success",
                message: result.message || "Profile updated!",
            });
        } else {
            setToast({
                type: "error",
                message: result.error,
            });
        }

        dispatch(resetEditProfile());
    }

    const fullName =
        `${form.firstName} ${form.lastName}`.trim() || "Developer";

    if (status === "pending") {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10">
                Loading...
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10">
                <div className="alert alert-error">
                    <span>{error}</span>

                    <button
                        className="btn btn-sm"
                        onClick={() => dispatch(getProfile())}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">

            {toast && (
                <div className="toast toast-top toast-end z-50">
                    <div
                        className={`alert ${toast.type === "success"
                            ? "alert-success"
                            : "alert-error"
                            }`}
                    >
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-bold mb-1">
                My Profile
            </h1>

            <p className="text-base-content/50 mb-8">
                Manage your developer profile
            </p>

            <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit}
            >
                {/* Profile Header */}

                <div className="flex flex-col gap-5">

                    <ProfilePhotoUploader
                        photoUrl={form.photoUrl}
                        fullName={fullName}
                        firstName={form.firstName}
                        onUploadSuccess={(imageUrl) =>
                            setForm((prev) => ({
                                ...prev,
                                photoUrl: imageUrl,
                            }))
                        }
                    />

                    <div>

                        <div className="flex items-center gap-2">

                            <h2 className="text-xl font-bold">
                                {fullName}
                            </h2>

                            {isPremium && (
                                <div
                                    className={`badge badge-sm px-4 ${membershipType === "gold"
                                        ? "badge-warning"
                                        : "badge-primary"
                                        }`}
                                >
                                    {membershipType === "gold"
                                        ? "⭐ GOLD Member"
                                        : "⚡ PRO Member"}
                                </div>
                            )}

                        </div>

                        <p className="text-base-content/60">
                            {form.emailId}
                        </p>

                        {form.age && (
                            <p className="text-sm text-base-content/40">
                                Age {form.age}
                            </p>
                        )}

                    </div>

                </div>

                <div className="divider" />

                {/* About */}
                <div className="form-control w-full">
                    <div className="label">
                        <span className="label-text font-medium">
                            About
                        </span>
                    </div>

                    <textarea
                        name="about"
                        value={form.about}
                        onChange={handleChange}
                        maxLength={500}
                        placeholder="Tell other developers about yourself..."
                        className="textarea textarea-bordered w-full h-32 resize-none"
                    />

                    <div className="label">
                        <span className="label-text-alt ml-auto">
                            {form.about.length}/500
                        </span>
                    </div>
                </div>

                {/* Skills */}

                <div className="form-control">

                    <label className="label">

                        <span className="label-text">
                            Skills
                        </span>

                    </label>

                    <div className="flex flex-wrap gap-2">

                        {form.skills.map((skill) => (
                            <button
                                key={skill}
                                type="button"
                                className="badge badge-primary badge-lg"
                                onClick={() => toggleSkill(skill)}
                            >
                                {skill} ✕
                            </button>
                        ))}

                    </div>

                    {form.skills.length === 0 && (
                        <p className="text-sm text-base-content/50 mt-2">
                            No skills added yet.
                        </p>
                    )}

                </div>

                <button
                    className="btn btn-primary mt-4"
                    disabled={editStatus === "pending"}
                >
                    {editStatus === "pending"
                        ? "Saving..."
                        : "Save Profile"}
                </button>

            </form>

        </div>
    );
}

export default Profile;