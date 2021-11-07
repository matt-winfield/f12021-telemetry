import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../../common/types/message";
import { PacketMotionData } from "../../../common/types/packet-motion-data";
import { PacketIds } from "../../../common/constants/packet-ids";
import { PacketSessionData } from "../../../common/types/packet-session-data";
import { PacketLapData } from "../../../common/types/packet-lap-data";

type SliceState = {
	motionData?: PacketMotionData;
	sessionData?: PacketSessionData;
	lapData?: PacketLapData;
}

const initialState: SliceState = {
	motionData: undefined,
	sessionData: undefined,
	lapData: undefined
}

export const liveDataSlice = createSlice({
	name: 'live-data',
	initialState,
	reducers: {
		liveDataUpdated: (state, action: PayloadAction<Message>) => {
			const message = action.payload;
			if (!message || !message.m_header) {
				return;
			}

			switch (message.m_header.m_packetId) {
				case PacketIds.Motion:
					state.motionData = message as PacketMotionData;
					break;
				case PacketIds.Session:
					state.sessionData = message as PacketSessionData;
					break;
				case PacketIds.LapData:
					state.lapData = message as PacketLapData;
					break;
			}
		}
	}
});

export const { liveDataUpdated } = liveDataSlice.actions;
export default liveDataSlice.reducer;