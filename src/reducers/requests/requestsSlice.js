import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    getRequests: {
        status: "idle",
        error: null,
    },
    reviewRequests: {
        // keyed by request ID for easy access
        byId: {},
    }
}

const requestsSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {
        getRequestsPending: (state) => {
            state.getRequests.status = "pending";
            state.getRequests.error = null;
        },
        getRequestsSuccess: (state, action) => {
            state.getRequests.status = "success";
            state.items = action.payload || [];
            state.getRequests.error = null;
        },
        getRequestsError: (state, action) => {
            state.getRequests.status = "error";
            state.getRequests.error = action.payload || 'Unable to fetch requests. Please try again.';
        },
        reviewRequestPending: (state, action) => {
            const requestId = action.payload;
            state.reviewRequests.byId[requestId] = {
                status: "pending",
                error: null,
            };
        },
        reviewRequestSuccess: (state, action) => {
            const { requestId } = action.payload;
            state.reviewRequests.byId[requestId] = {
                status: "success",
                error: null,
            };
            state.items = state.items.filter(request => request.id !== requestId);
        },
        reviewRequestError: (state, action) => {
            const { requestId, error } = action.payload;
            state.reviewRequests.byId[requestId] = {
                status: "error",
                error: error || 'Unable to review request. Please try again.',
            };
        },
    },
})

export const { getRequestsPending, getRequestsSuccess, getRequestsError, reviewRequestPending, reviewRequestSuccess, reviewRequestError } = requestsSlice.actions;

export default requestsSlice.reducer;