import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import infoReducer from "./infoSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        info: infoReducer,
        ui: uiReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch