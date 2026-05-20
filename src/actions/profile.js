import { ENDPOINTS } from "../api/endpoints";
import { buildAuthHeaders } from "../api/auth";
import {
  getProfilePending,
  getProfileSuccess,
  getProfileError,
  editProfilePending,
  editProfileSuccess,
  editProfileError,
} from "../reducers/profile/profileSlice";
import {
  GET_PROFILE,
  GET_PROFILE_PENDING,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_ERROR,
  EDIT_PROFILE,
  EDIT_PROFILE_PENDING,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_ERROR,
} from "../constants/profileConstants";

export const getProfile = () => async (dispatch) => {
  console.info(`[profile] ${GET_PROFILE}`);
  dispatch(getProfilePending());
  console.info(`[profile] ${GET_PROFILE_PENDING}`);

  try {
    const res = await fetch(ENDPOINTS.PROFILE_VIEW, {
      method: "GET",
      headers: buildAuthHeaders(),
      credentials: "include",
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const message =
        data?.message ||
        data?.error ||
        `Failed to load profile (${res.status})`;
      throw new Error(message);
    }

    const profile = data?.data || data;
    dispatch(getProfileSuccess(profile));
    console.info(`[profile] ${GET_PROFILE_SUCCESS}`, { userId: profile?._id });

    return { success: true, data: profile };
  } catch (error) {
    const errorMessage =
      error instanceof TypeError
        ? "Network error. Please check your connection and try again."
        : error.message || "Failed to load profile.";

    dispatch(getProfileError(errorMessage));
    console.error(`[profile] ${GET_PROFILE_ERROR}`, { error: errorMessage });

    return { success: false, error: errorMessage };
  }
};

export const editProfile =
  ({ skills, photoUrl, about }) =>
  async (dispatch) => {
    const payload = { skills, photoUrl, about };
    console.info(`[profile] ${EDIT_PROFILE}`, { fields: Object.keys(payload) });
    dispatch(editProfilePending());
    console.info(`[profile] ${EDIT_PROFILE_PENDING}`);

    try {
      const res = await fetch(ENDPOINTS.PROFILE_EDIT, {
        method: "PATCH",
        headers: buildAuthHeaders({ "Content-Type": "application/json" }),
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message =
          data?.message ||
          data?.error ||
          `Failed to update profile (${res.status})`;
        throw new Error(message);
      } // API returns { message, data } — store the nested data object

      const updated = data?.data || data;
      dispatch(editProfileSuccess(updated));
      console.info(`[profile] ${EDIT_PROFILE_SUCCESS}`, {
        userId: updated?._id,
      });

      return { success: true, message: data?.message, data: updated };
    } catch (error) {
      const errorMessage =
        error instanceof TypeError
          ? "Network error. Please check your connection and try again."
          : error.message || "Failed to update profile.";

      dispatch(editProfileError(errorMessage));
      console.error(`[profile] ${EDIT_PROFILE_ERROR}`, { error: errorMessage });

      return { success: false, error: errorMessage };
    }
  };
