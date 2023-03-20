import { configureStore } from '@reduxjs/toolkit';
// import counterReducer from '../features/counter/userSlice';
import userReducer from "../features/userSlice";

export const store = configureStore({
    reducer: {
        userData: userReducer,
    },
});