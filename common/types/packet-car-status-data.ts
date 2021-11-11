import { CarStatusData } from "./car-status-data";
import { PacketHeader } from "./packet-header";

export type PacketCarStatusData = {
	m_header: PacketHeader;
	m_carStatusData: CarStatusData[];
}