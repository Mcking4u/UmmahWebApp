import { createSlice } from '@reduxjs/toolkit'

export const navSlice = createSlice({
  name: 'nav',
  initialState: {
    headerText: "Dashboard",
    activeLink: "/",
  },
  reducers: {
    updateNavState: (state, action) => {
        let data = action.payload;
        state.headerText = data.headerText;
        state.activeLink = data.activeLink;
    },
  },
})

export const { updateNavState } = navSlice.actions
export default navSlice.reducer