import { PacketCarSetupData } from "./packet-car-setup-data";
import { PacketCarTelemetryData } from "./packet-car-telemetry-data";
import { PacketEventData } from "./packet-event-data";
import { PacketLapData } from "./packet-lap-data";
import { PacketMotionData } from "./packet-motion-data";
import { PacketParticipantsData } from "./packet-participants-data";
import { PacketSessionData } from "./packet-session-data";

export type Message =
	PacketMotionData
	| PacketSessionData
	| PacketLapData
	| PacketEventData
	| PacketParticipantsData
	| PacketCarSetupData
	| PacketCarTelemetryData;