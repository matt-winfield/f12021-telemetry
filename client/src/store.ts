import { combineReducers, configureStore } from "@reduxjs/toolkit";
import liveDataReducer from "./slices/live-data-slice";
import packetSubscriptionsReducer from './slices/packet-subscriptions-slice';

const reducer = combineReducers({
	liveData: liveDataReducer,
	packetSubscriptions: packetSubscriptionsReducer
})

const store = configureStore({
	reducer
})

export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export default store;