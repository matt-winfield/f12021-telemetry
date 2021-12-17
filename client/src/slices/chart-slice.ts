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

export const activeLapDistanceAtom = atom<number | null>({
	key: 'activeLapDistance',
	default: null
})

type SliceState = {
	dataMax: number;
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
		}
	}
})

export const { updateDataMax, resetDataMax } = chartSlice.actions;
export default chartSlice.reducer;