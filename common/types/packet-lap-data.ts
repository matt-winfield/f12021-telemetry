import { LapData } from "./lap-data";
import { PacketHeader } from "./packet-header";

export type PacketLapData = {
	m_header: PacketHeader;
	m_lapData: LapData[];
}