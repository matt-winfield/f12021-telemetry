import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../../common/types/message";
import { PacketMotionData } from "../../../common/types/packet-motion-data";
import { PacketIds } from "../../../common/constants/packet-ids";
import { PacketSessionData } from "../../../common/types/packet-session-data";
import { PacketLapData } from "../../../common/types/packet-lap-data";
import { PacketEventData } from "../../../common/types/packet-event-data";
import { PacketParticipantsData } from "../../../common/types/packet-participants-data";
import { PacketCarSetupData } from "../../../common/types/packet-car-setup-data";
import { PacketCarTelemetryData } from "../../../common/types/packet-car-telemetry-data";
import { PacketCarStatusData } from "../../../common/types/packet-car-status-data";

type SliceState = {
	motionData?: PacketMotionData;
	sessionData?: PacketSessionData;
	lapData?: PacketLapData;
	eventData?: PacketEventData;
	participantsData?: PacketParticipantsData;
	carSetupsData?: PacketCarSetupData;
	carTelemetryData?: PacketCarTelemetryData;
	carStatusData?: PacketCarStatusData
}

const initialState: SliceState = {
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
				case PacketIds.Event:
					state.eventData = message as PacketEventData;
					break;
				case PacketIds.Participants:
					state.participantsData = message as PacketParticipantsData;
					break;
				case PacketIds.CarSetups:
					state.carSetupsData = message as PacketCarSetupData;
					break;
				case PacketIds.CarTelemetry:
					state.carTelemetryData = message as PacketCarTelemetryData;
					break;
				case PacketIds.CarStatus:
					state.carStatusData = message as PacketCarStatusData;
					break;
			}
		}
	}
});

export const { liveDataUpdated } = liveDataSlice.actions;
export default liveDataSlice.reducer;