import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type SliceState = {
	zoomStart?: number;
	zoomEnd?: number;
	dataMax: number;
}

const initialState: SliceState = {
	dataMax: 0
}

type UpdateZoomPayload = {
	zoomStart?: number,
	zoomEnd?: number,
}

const prepareUpdateZoomPayload = (zoomStart: number, zoomEnd: number) =>
	({ payload: { zoomStart, zoomEnd } })

export const chartSlice = createSlice({
	name: 'chart',
	initialState,
	reducers: {
		updateZoom: {
			reducer: (state, action: PayloadAction<UpdateZoomPayload>) => {
				state.zoomStart = action.payload.zoomStart;
				state.zoomEnd = action.payload.zoomEnd;
			},
			prepare: prepareUpdateZoomPayload
		},
		resetZoom: (state) => {
			state.zoomStart = undefined;
			state.zoomEnd = undefined;
		},
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

export const { updateZoom, resetZoom, updateDataMax, resetDataMax } = chartSlice.actions;
export default chartSlice.reducer;