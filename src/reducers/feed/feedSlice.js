import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    getFeed: {
        status: "idle",
        error: null,
    },
}

const feedSlice = createSlice({
    name: "feed",
    initialState,
    reducers: {
        getFeedPending: (state) => {
            state.getFeed.status = "pending";
            state.getFeed.error = null;
        },
        getFeedSuccess: (state, action) => {
            state.getFeed.status = "success";
            state.items = action.payload || [];
            state.getFeed.error = null;
        },
        getFeedError: (state, action) => {
            state.getFeed.status = "error";
            state.getFeed.error = action.payload || 'Unable to fetch feed. Please try again.';
        },
    },
})

export const { getFeedPending, getFeedSuccess, getFeedError } = feedSlice.actions;

export default feedSlice.reducer;