import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./reducers/chatReducer";

export const store = configureStore({
    reducer:{
        ChatR:chatReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch