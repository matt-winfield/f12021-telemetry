import { CarTelemetryData } from "./car-telemetry-data";
import { PacketHeader } from "./packet-header";

export type PacketCarTelemetryData = {
	m_header: PacketHeader;
	m_carTelemetryData: CarTelemetryData[];
	m_mfdPanelIndex: number;
	m_mfdPanelIndexSecondaryPlayer: number;
	m_suggestedGear: number;
}