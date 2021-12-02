import { CarDamageData } from "./car-damage-data";
import { PacketHeader } from "./packet-header";

export type PacketCarDamageData = {
	m_header: PacketHeader;
	m_carDamageData: CarDamageData[];
}