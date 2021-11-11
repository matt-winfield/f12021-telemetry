import { CarSetupData } from "./car-setup-data";
import { PacketHeader } from "./packet-header";

export type PacketCarSetupData = {
	m_header: PacketHeader;
	m_carSetups: CarSetupData[];
}