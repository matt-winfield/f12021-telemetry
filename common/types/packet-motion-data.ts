import { PacketHeader } from "./packet-header";
import { MotionData, PlayerMotionData } from "./motion-data";

export type PacketMotionData = {
	m_header: PacketHeader;
	m_carMotionData: MotionData[];
} & PlayerMotionData;