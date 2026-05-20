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
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    getProfilePending: (state) => {
      state.getProfile.status = "pending";
      state.getProfile.error = null;
    },
    getProfileSuccess: (state, action) => {
      state.getProfile.status = "success";
      state.data = action.payload || null;
      state.getProfile.error = null;
    },
    getProfileError: (state, action) => {
      state.getProfile.status = "error";
      state.getProfile.error =
        action.payload || "Unable to fetch profile. Please try again.";
    },
    editProfilePending: (state) => {
      state.editProfile.status = "pending";
      state.editProfile.error = null;
    },
    editProfileSuccess: (state, action) => {
      state.editProfile.status = "success";
      state.data = {
        ...state.data,
        ...action.payload,
      };
      state.editProfile.error = null;
    },
    resetEditProfile: (state) => {
      state.editProfile.status = "idle";
      state.editProfile.error = null;
    },
    editProfileError: (state, action) => {
      state.editProfile.status = "error";
      state.editProfile.error =
        action.payload || "Unable to edit profile. Please try again.";
    },
  },
});

export const {
  getProfilePending,
  getProfileSuccess,
  getProfileError,
  editProfilePending,
  editProfileSuccess,
  resetEditProfile,
  editProfileError,
} = profileSlice.actions;

export default profileSlice.reducer;
