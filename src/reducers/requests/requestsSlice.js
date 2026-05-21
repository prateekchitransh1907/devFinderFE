import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  getRequests: {
    status: "idle",
    error: null,
  },
  reviewRequest: {
    // keyed by requestId so each card tracks its own loading/error state
    byId: {},
  },
};

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    getRequestsPending: (state) => {
      state.getRequests.status = "pending";
      state.getRequests.error = null;
    },
    getRequestsSuccess: (state, action) => {
      state.items = action.payload;
      state.getRequests.status = "success";
      state.getRequests.error = null;
    },
    getRequestsError: (state, action) => {
      state.getRequests.status = "error";
      state.getRequests.error = action.payload || "Failed to load requests.";
    },
    reviewRequestPending: (state, action) => {
      const id = action.payload;
      state.reviewRequest.byId[id] = { status: "pending", error: null };
    },
    reviewRequestSuccess: (state, action) => {
      const id = action.payload;
      state.reviewRequest.byId[id] = { status: "success", error: null };
      state.items = state.items.filter((r) => r._id !== id);
    },
    reviewRequestError: (state, action) => {
      const { id, error } = action.payload;
      state.reviewRequest.byId[id] = { status: "error", error };
    },
  },
});

export const {
  getRequestsPending,
  getRequestsSuccess,
  getRequestsError,
  reviewRequestPending,
  reviewRequestSuccess,
  reviewRequestError,
} = requestsSlice.actions;

export default requestsSlice.reducer;
