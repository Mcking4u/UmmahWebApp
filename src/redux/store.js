import { configureStore } from '@reduxjs/toolkit'
import navReducer from "./navSlice";

export default configureStore({
  reducer: {
    nav : navReducer,
},
})