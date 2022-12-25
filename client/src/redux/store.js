import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import loadersReducer from "./loadersSlice";
import usersReducer from "./usersSlice";

const store = configureStore({
  reducer: {
    loadersReducer,
    usersReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
