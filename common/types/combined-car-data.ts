import { CarDamageData } from "./car-damage-data";
import { CarSetupData } from "./car-setup-data";
import { CarStatusData } from "./car-status-data";
import { CarTelemetryData } from "./car-telemetry-data";
import { FinalClassifcationData } from "./final-classification-data";
import { LapData } from "./lap-data";
import { MotionData, PlayerMotionData } from "./motion-data";
import { EventData } from "./packet-event-data";
import { SessionData } from "./packet-session-data";
import { SessionHistoryData } from "./packet-session-history-data";

export type CombinedCarData = Partial<
	MotionData
	& PlayerMotionData
	& SessionData
	& LapData
	& EventData
	& CarSetupData
	& CarTelemetryData
	& CarStatusData
	& FinalClassifcationData
	& CarDamageData
	& SessionHistoryData
>;