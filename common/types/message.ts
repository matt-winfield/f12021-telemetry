import { PacketEventData } from "./packet-event-data";
import { PacketLapData } from "./packet-lap-data";
import { PacketMotionData } from "./packet-motion-data";
import { PacketSessionData } from "./packet-session-data";

export type Message =
	PacketMotionData
	| PacketSessionData
	| PacketLapData
	| PacketEventData;