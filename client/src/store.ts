import { combineReducers, configureStore } from "@reduxjs/toolkit";

const reducer = combineReducers({

})

const store = configureStore({
	reducer
})

export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export default store;