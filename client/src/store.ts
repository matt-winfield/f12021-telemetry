import { combineReducers, configureStore } from "@reduxjs/toolkit";
import liveDataReducer from "./slices/live-data-slice";

const reducer = combineReducers({
	liveData: liveDataReducer
})

const store = configureStore({
	reducer
})

export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export default store;