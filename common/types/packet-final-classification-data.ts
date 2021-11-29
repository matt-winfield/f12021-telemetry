import { FinalClassifcationData } from "./final-classification-data";
import { PacketHeader } from "./packet-header";

export type PacketFinalClassificationData = {
	m_header: PacketHeader;
	m_numCars: number;
	m_classificationData: FinalClassifcationData[];
}