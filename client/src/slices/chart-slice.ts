import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { atom } from 'recoil';

export const zoomStartAtom = atom<number | null>({
	key: 'zoomStart',
	default: null
});

export const zoomEndAtom = atom<number | null>({
	key: 'zoomEnd',
	default: null
})

type SliceState = {
	dataMax: number;
	activeLapDistance?: number;
}

const initialState: SliceState = {
	dataMax: 0
}

export const chartSlice = createSlice({
	name: 'chart',
	initialState,
	reducers: {
		updateDataMax: (state, action: PayloadAction<number>) => {
			if (state.dataMax === undefined || action.payload > state.dataMax) {
				state.dataMax = action.payload;
			}
		},
		resetDataMax: (state) => {
			state.dataMax = 0;
		},
		updateActiveLapDistance: (state, action: PayloadAction<number | undefined>) => {
			state.activeLapDistance = action.payload;
		}
	}
})

export const { updateDataMax, resetDataMax, updateActiveLapDistance } = chartSlice.actions;
export default chartSlice.reducer;