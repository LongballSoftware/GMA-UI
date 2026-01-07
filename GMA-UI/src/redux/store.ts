import { configureStore } from "@reduxjs/toolkit";
import worldReducer from "./worldSlice";
import userReducer from "./userSlice";

export const store = configureStore({
    reducer: {
        world: worldReducer,
        user: userReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;