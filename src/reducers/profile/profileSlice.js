import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,

  getProfile: {
    status: "idle",
    error: null,
  },

  editProfile: {
    status: "idle",
    error: null,
  },

  uploadProfilePicture: {
    status: "idle",
    error: null,
  },
};

const profileSlice = createSlice({
  name: "profile",
  initialState,

  reducers: {
    // ==========================
    // GET PROFILE
    // ==========================

    getProfilePending: (state) => {
      state.getProfile.status = "pending";
      state.getProfile.error = null;
    },

    getProfileSuccess: (state, action) => {
      state.getProfile.status = "success";
      state.getProfile.error = null;
      state.data = action.payload || null;
    },

    getProfileError: (state, action) => {
      state.getProfile.status = "error";
      state.getProfile.error = action.payload || "Unable to fetch profile.";
    },

    // ==========================
    // EDIT PROFILE
    // ==========================

    editProfilePending: (state) => {
      state.editProfile.status = "pending";
      state.editProfile.error = null;
    },

    editProfileSuccess: (state, action) => {
      state.editProfile.status = "success";
      state.editProfile.error = null;

      state.data = {
        ...(state.data || {}),
        ...action.payload,
      };
    },

    editProfileError: (state, action) => {
      state.editProfile.status = "error";
      state.editProfile.error = action.payload || "Unable to edit profile.";
    },

    resetEditProfile: (state) => {
      state.editProfile.status = "idle";
      state.editProfile.error = null;
    },

    // ==========================
    // PROFILE PICTURE
    // ==========================

    uploadProfilePicturePending: (state) => {
      state.uploadProfilePicture.status = "pending";
      state.uploadProfilePicture.error = null;
    },

    uploadProfilePictureSuccess: (state, action) => {
      state.uploadProfilePicture.status = "success";
      state.uploadProfilePicture.error = null;

      state.data = {
        ...(state.data || {}),
        ...action.payload.user,
      };
    },

    uploadProfilePictureError: (state, action) => {
      state.uploadProfilePicture.status = "error";
      state.uploadProfilePicture.error =
        action.payload || "Unable to upload image.";
    },

    resetUploadProfilePicture: (state) => {
      state.uploadProfilePicture.status = "idle";
      state.uploadProfilePicture.error = null;
    },
  },
});

export const {
  getProfilePending,
  getProfileSuccess,
  getProfileError,

  editProfilePending,
  editProfileSuccess,
  editProfileError,
  resetEditProfile,

  uploadProfilePicturePending,
  uploadProfilePictureSuccess,
  uploadProfilePictureError,
  resetUploadProfilePicture,
} = profileSlice.actions;

export default profileSlice.reducer;
