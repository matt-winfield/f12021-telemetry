import { combineReducers, configureStore } from "@reduxjs/toolkit";
import chartReducer from './slices/chart-slice';
import liveDataReducer from "./slices/live-data-slice";
import packetSubscriptionsReducer from './slices/packet-subscriptions-slice';

const reducer = combineReducers({
	liveData: liveDataReducer,
	packetSubscriptions: packetSubscriptionsReducer,
	charts: chartReducer
})

const store = configureStore({
	reducer
})

export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export default store;