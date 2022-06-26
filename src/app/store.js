import { configureStore } from "@reduxjs/toolkit";
import newReducer from "../features/slices/reposSlice";

export const store = configureStore({
  reducer: {
    data: newReducer,
  },
});
