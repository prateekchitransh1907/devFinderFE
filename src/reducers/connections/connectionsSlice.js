import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    getConnections: {
        status: "idle",
        error: null,
    },
}

const connectionsSlice = createSlice({
    name: "connections",
    initialState,
    reducers: {
        getConnectionsPending: (state) => {
            state.getConnections.status = "pending";
            state.getConnections.error = null;
        },
        getConnectionsSuccess: (state, action) => {
            state.getConnections.status = "success";
            state.items = action.payload || [];
            state.getConnections.error = null;
        },
        getConnectionsError: (state, action) => {
            state.getConnections.status = "error";
            state.getConnections.error = action.payload || 'Unable to fetch connections. Please try again.';
        },
    },
})

export const { getConnectionsPending, getConnectionsSuccess, getConnectionsError } = connectionsSlice.actions;

export default connectionsSlice.reducer;