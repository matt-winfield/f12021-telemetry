import { Message } from "./message";
import { PacketCarDamageData } from "./packet-car-damage-data";
import { PacketCarSetupData } from "./packet-car-setup-data";
import { PacketCarStatusData } from "./packet-car-status-data";
import { PacketCarTelemetryData } from "./packet-car-telemetry-data";
import { PacketEventData } from "./packet-event-data";
import { PacketFinalClassificationData } from "./packet-final-classification-data";
import { PacketLapData } from "./packet-lap-data";
import { PacketLobbyInfoData } from "./packet-lobby-info-data";
import { PacketMotionData } from "./packet-motion-data";
import { PacketParticipantsData } from "./packet-participants-data";
import { PacketSessionData } from "./packet-session-data";
import { PacketSessionHistoryData } from "./packet-session-history-data";

export type CombinedData = Partial<
	PacketMotionData
	& PacketSessionData
	& PacketLapData
	& PacketEventData
	& PacketParticipantsData
	& PacketCarSetupData
	& PacketCarTelemetryData
	& PacketCarStatusData
	& PacketFinalClassificationData
	& PacketLobbyInfoData
	& PacketCarDamageData
	& PacketSessionHistoryData
>;