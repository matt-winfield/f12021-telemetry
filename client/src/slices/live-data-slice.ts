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
import { PacketFinalClassificationData } from "../../../common/types/packet-final-classification-data";
import { PacketLobbyInfoData } from "../../../common/types/packet-lobby-info-data";

type SliceState = {
	motion?: PacketMotionData;
	session?: PacketSessionData;
	lap?: PacketLapData;
	event?: PacketEventData;
	participants?: PacketParticipantsData;
	carSetups?: PacketCarSetupData;
	carTelemetry?: PacketCarTelemetryData;
	carStatus?: PacketCarStatusData;
	finalClassification?: PacketFinalClassificationData;
	lobbyInfo?: PacketLobbyInfoData;
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
					state.motion = message as PacketMotionData;
					break;
				case PacketIds.Session:
					state.session = message as PacketSessionData;
					break;
				case PacketIds.LapData:
					state.lap = message as PacketLapData;
					break;
				case PacketIds.Event:
					state.event = message as PacketEventData;
					break;
				case PacketIds.Participants:
					state.participants = message as PacketParticipantsData;
					break;
				case PacketIds.CarSetups:
					state.carSetups = message as PacketCarSetupData;
					break;
				case PacketIds.CarTelemetry:
					state.carTelemetry = message as PacketCarTelemetryData;
					break;
				case PacketIds.CarStatus:
					state.carStatus = message as PacketCarStatusData;
					break;
				case PacketIds.FinalClassification:
					state.finalClassification = message as PacketFinalClassificationData;
					break;
				case PacketIds.LobbyInfo:
					state.lobbyInfo = message as PacketLobbyInfoData;
					break;
			}
		}
	}
});

export const { liveDataUpdated } = liveDataSlice.actions;
export default liveDataSlice.reducer;