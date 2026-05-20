import { ENDPOINTS } from "../api/endpoints";
import {
  loginUserPending,
  loginUserSuccess,
  loginUserError,
  signupUserPending,
  signupUserSuccess,
  signupUserError,
} from "../reducers/auth/authSlice";
import {
  LOGIN_USER,
  LOGIN_USER_PENDING,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  SIGNUP_USER,
  SIGNUP_USER_PENDING,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_ERROR,
} from "../constants/authConstants";

function getApiErrorMessage(payload) {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  if (typeof payload.message === "string") return payload.message;
  if (typeof payload.error === "string") return payload.error;
  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    const firstError = payload.errors[0];
    if (typeof firstError === "string") return firstError;
    if (firstError?.message) return firstError.message;
  }
  return "";
}

export const loginUser = (credentials) => async (dispatch) => {
  const emailId = credentials?.emailId?.trim() || "";

  console.info(`[auth] ${LOGIN_USER}`, { emailId });
  dispatch(loginUserPending());
  console.info(`[auth] ${LOGIN_USER_PENDING}`, { emailId });

  try {
    const res = await fetch(ENDPOINTS.AUTH_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ emailId, password: credentials.password }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const apiErrorMessage = getApiErrorMessage(data);
      throw new Error(apiErrorMessage || `Login failed (${res.status})`);
    }

    const payload = data && typeof data === "object" ? data : {};
    const authPayload =
      payload?.data && typeof payload.data === "object"
        ? payload.data
        : payload;
    const token =
      authPayload.token || authPayload.accessToken || authPayload.jwt || null;
    const user = authPayload.user || payload.user || null;

    dispatch(loginUserSuccess({ token, user }));
    console.info(`[auth] ${LOGIN_USER_SUCCESS}`, {
      emailId,
      hasToken: Boolean(token),
      hasUser: Boolean(user),
    });

    return { success: true, payload };
  } catch (error) {
    const errorMessage =
      error instanceof TypeError
        ? "Network error. Please check your connection and try again."
        : error.message || "Unable to login. Please try again.";

    dispatch(loginUserError(errorMessage));
    console.error(`[auth] ${LOGIN_USER_ERROR}`, {
      emailId,
      error: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};

export const signupUser = (fields) => async (dispatch) => {
  const emailId = fields?.emailId?.trim() || "";

  console.info(`[auth] ${SIGNUP_USER}`, { emailId });
  dispatch(signupUserPending());
  console.info(`[auth] ${SIGNUP_USER_PENDING}`, { emailId });

  try {
    const body = {
      firstName: fields.firstName?.trim(),
      lastName: fields.lastName?.trim(),
      emailId,
      password: fields.password,
      gender: fields.gender,
      about: fields.about?.trim(),
      age: fields.age ? Number(fields.age) : undefined,
      skills: fields.skills,
    };

    const res = await fetch(ENDPOINTS.AUTH_SIGNUP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const apiErrorMessage = getApiErrorMessage(data);
      throw new Error(apiErrorMessage || `Sign up failed (${res.status})`);
    }

    const payload = data && typeof data === "object" ? data : {};
    const authPayload =
      payload?.data && typeof payload.data === "object"
        ? payload.data
        : payload;
    const token =
      authPayload.token || authPayload.accessToken || authPayload.jwt || null;
    const user = authPayload.user || payload.user || null;

    dispatch(signupUserSuccess({ token, user }));
    console.info(`[auth] ${SIGNUP_USER_SUCCESS}`, {
      emailId,
      hasToken: Boolean(token),
    });

    return { success: true, payload };
  } catch (error) {
    const errorMessage =
      error instanceof TypeError
        ? "Network error. Please check your connection and try again."
        : error.message || "Unable to sign up. Please try again.";

    dispatch(signupUserError(errorMessage));
    console.error(`[auth] ${SIGNUP_USER_ERROR}`, {
      emailId,
      error: errorMessage,
    });

    return { success: false, error: errorMessage };
  }
};
