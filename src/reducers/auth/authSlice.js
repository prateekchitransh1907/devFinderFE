import { createSlice } from "@reduxjs/toolkit";

const persistedToken = localStorage.getItem("token");
const persistedUser = localStorage.getItem("authUser");

let parsedPersistedUser = null;
if (persistedUser) {
  try {
    parsedPersistedUser = JSON.parse(persistedUser);
  } catch (error) {
    parsedPersistedUser = null;
    console.error("Failed to parse persisted user data:", error);
  }
}

const initialState = {
  token: persistedToken || null,
  user: parsedPersistedUser,
  isAuthenticated: Boolean(persistedToken || parsedPersistedUser),
  login: {
    status: "idle",
    error: null,
  },
  signup: {
    status: "idle",
    error: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUserPending: (state) => {
      state.login.status = "pending";
      state.login.error = null;
    },
    loginUserSuccess: (state, action) => {
      const { token = null, user = null } = action.payload;
      state.login.status = "success";
      state.token = token;
      state.user = user;
      state.isAuthenticated = Boolean(token || user);

      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }

      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("authUser");
      }
    },
    loginUserError: (state, action) => {
      state.login.status = "error";
      state.login.error =
        action.payload || "Unable to login. Please try again.";
    },
    clearAuthError: (state) => {
      state.login.error = null;
      if (state.login.status === "error") {
        state.login.status = "idle";
      }
      state.signup.error = null;
      if (state.signup.status === "error") {
        state.signup.status = "idle";
      }
    },
    signupUserPending: (state) => {
      state.signup.status = "pending";
      state.signup.error = null;
    },
    signupUserSuccess: (state, action) => {
      const { token = null, user = null } = action.payload || {};
      state.token = token;
      state.user = user;
      state.isAuthenticated = Boolean(token || user);
      state.signup.status = "success";
      state.signup.error = null;

      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }

      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("authUser");
      }
    },
    signupUserError: (state, action) => {
      state.signup.status = "error";
      state.signup.error =
        action.payload || "Unable to sign up. Please try again.";
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.login.status = "idle";
      state.login.error = null;
      state.signup.status = "idle";
      state.signup.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("authUser");
    },
  },
});

export const {
  loginUserPending,
  loginUserSuccess,
  loginUserError,
  clearAuthError,
  signupUserPending,
  signupUserSuccess,
  signupUserError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
