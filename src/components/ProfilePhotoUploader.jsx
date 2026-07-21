import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { editProfile, getProfile } from "../actions/profile";
import { ENDPOINTS } from "../api/endpoints";

function ProfilePhotoUploader({
    photoUrl,
    fullName,
    firstName,
    onUploadSuccess,
}) {
    const dispatch = useDispatch();

    const fileInputRef = useRef(null);

    const [previewUrl, setPreviewUrl] = useState(photoUrl);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setPreviewUrl(photoUrl);
    }, [photoUrl]);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be less than 5MB");
            return;
        }

        const tempPreview = URL.createObjectURL(file);

        setPreviewUrl(tempPreview);
        setUploading(true);

        try {
            const formData = new FormData();

            formData.append("photo", file);

            const response = await fetch(
                ENDPOINTS.UPLOAD_PROFILE_PICTURE,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to upload image"
                );
            }

            const imageUrl = data.imageUrl;

            const result = await dispatch(
                editProfile({
                    photoUrl: imageUrl,
                })
            );

            if (!result.success) {
                throw new Error(
                    result.error || "Failed to update profile"
                );
            }

            dispatch(getProfile());

            setPreviewUrl(imageUrl);

            onUploadSuccess?.(imageUrl);

            URL.revokeObjectURL(tempPreview);
        } catch (error) {
            console.error(error);

            alert(error.message);

            setPreviewUrl(photoUrl);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-5">

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
            />

            <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="avatar">
                    <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">

                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt={fullName}
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="bg-primary text-primary-content w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold">
                                {firstName?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                        )}

                    </div>
                </div>

                <div className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">

                    {uploading ? (
                        <>
                            <span className="loading loading-spinner loading-sm text-white" />
                            <span className="text-white text-xs mt-1">
                                Uploading
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="text-2xl">
                                📷
                            </span>

                            <span className="text-white text-xs font-medium">
                                Change
                            </span>
                        </>
                    )}

                </div>
            </div>

            <div>
                <p className="font-semibold text-lg">
                    {fullName || "Your Name"}
                </p>

                <p className="text-sm text-base-content/50">
                    Click photo to update
                </p>
            </div>

        </div>
    );
}

export default ProfilePhotoUploader;