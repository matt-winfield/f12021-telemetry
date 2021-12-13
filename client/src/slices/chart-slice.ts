import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type SliceState = {
	zoomStart: string | number;
	zoomEnd: string | number;
}

const initialState: SliceState = {
	zoomStart: 'dataMin',
	zoomEnd: 'dataMax'
}

type UpdateZoomPayload = {
	zoomStart: string | number,
	zoomEnd: string | number
}

const prepareUpdateZoomPayload = (zoomStart: string | number, zoomEnd: string | number) =>
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
			state.zoomStart = 'dataMin';
			state.zoomEnd = 'dataMax';
		}
	}
})

export const { updateZoom, resetZoom } = chartSlice.actions;
export default chartSlice.reducer;