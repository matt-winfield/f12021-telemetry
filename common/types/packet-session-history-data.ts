import { PacketHeader } from "./packet-header"

export type LapHistoryData = {
	m_lapTimeInMS: number;
	m_sector1TimeInMS: number;
	m_sector2TimeInMS: number;
	m_sector3TimeInMS: number;
	m_lapValidBitFlags: number;
}

export type TyreStintHistoryData = {
	m_endLap: number;
	m_tyreActualCompound: number;
	m_tyreVisualCompound: number;
}

export type PacketSessionHistoryData = {
	m_header: PacketHeader;
} & SessionHistoryData;

export type SessionHistoryData = {
	m_carIdx: number;
	m_numLaps: number;
	m_numTyreStints: number;
	m_bestLapTimeLapNum: number;
	m_bestSector1LapNum: number;
	m_bestSector2LapNum: number;
	m_bestSector3LapNum: number;
	m_lapHistoryData: LapHistoryData[];
	m_tyreStintHistoryData: TyreStintHistoryData[];
}