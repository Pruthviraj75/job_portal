import { createSlice } from '@reduxjs/toolkit'


 const authSlice = createSlice({
  name: 'auth',
  initialState:{
    loading: false,
    user:null,
  },
  reducers: {
    //actions
    setLoading: (state, action) => {
         state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setLoading, setUser } = authSlice.actions

export default authSlice.reducer