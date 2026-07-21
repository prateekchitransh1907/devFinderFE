import { ENDPOINTS } from "../api/endpoints";

import {
  UPLOAD_PROFILE_PICTURE,
  UPLOAD_PROFILE_PICTURE_PENDING,
  UPLOAD_PROFILE_PICTURE_SUCCESS,
  UPLOAD_PROFILE_PICTURE_ERROR,
} from "../constants/profileConstants";

export const uploadProfilePicture = (file) => async (dispatch) => {
  console.info(`[profile] ${UPLOAD_PROFILE_PICTURE}`);

  dispatch({
    type: UPLOAD_PROFILE_PICTURE_PENDING,
  });

  try {
    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch(ENDPOINTS.UPLOAD_PROFILE_PICTURE, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || "Failed to upload profile picture");
    }

    dispatch({
      type: UPLOAD_PROFILE_PICTURE_SUCCESS,
      payload: data.imageUrl,
    });

    console.info(`[profile] ${UPLOAD_PROFILE_PICTURE_SUCCESS}`);

    return {
      success: true,
      imageUrl: data.imageUrl,
    };
  } catch (error) {
    console.error(`[profile] ${UPLOAD_PROFILE_PICTURE_ERROR}`, error);

    dispatch({
      type: UPLOAD_PROFILE_PICTURE_ERROR,
      payload: error.message,
    });

    return {
      success: false,
      error: error.message,
    };
  }
};
