import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"; 
import { combineReducers } from "redux";
import instructorReducer from "./slices/instructorSlice";

const rootReducer = combineReducers({
  user: userReducer,
  instructor: instructorReducer,
});

const store = configureStore({
  reducer: {
    reducer: rootReducer,
  },
});
export default store;
