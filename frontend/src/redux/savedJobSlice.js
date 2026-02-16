import { createSlice } from "@reduxjs/toolkit";

const savedJobSlice = createSlice({
    name: "savedJobs",
    initialState: {
        allSavedJobs: [],
    },
    reducers: {
        setSavedJobs: (state, action) => {
            state.allSavedJobs = action.payload;
        }
    }
})

export const { setSavedJobs } = savedJobSlice.actions;
export default savedJobSlice.reducer;