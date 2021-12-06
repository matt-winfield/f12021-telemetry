import { LapData } from "../../common/types/lap-data";
import { PacketLapData } from "../../common/types/packet-lap-data";
import DataManager from "../data-manager";
import LiveInfo from "../models/live-info";
import SessionData from "../models/session-data";

export default abstract class LapDataHandler {
	public static addLapData(message: PacketLapData, data: SessionData, liveInfo: LiveInfo, onLapComplete: (carIndex: number, newCurrentLap: number) => void): void {
		const sessionTime = message.m_header.m_sessionTime;
		this.addCarLapData(message, data, sessionTime, liveInfo, onLapComplete);
	}

	private static addCarLapData(message: PacketLapData, data: SessionData, sessionTime: number, liveInfo: LiveInfo, onLapComplete: (carIndex: number, newCurrentLap: number) => void): void {
		message.m_lapData.forEach((carLapData, carIndex) => {
			DataManager.prepareData(data, sessionTime, carIndex);
			data.carData[carIndex].data[sessionTime] = { ...data.carData[carIndex].data[sessionTime], ...carLapData };
			data.carData[carIndex].carIndex = carIndex;
			this.updateLiveLapInfo(carLapData, carIndex, liveInfo, onLapComplete);
		});
	}

	private static updateLiveLapInfo(carLapData: LapData, carIndex: number, liveInfo: LiveInfo, onLapComplete: (carIndex: number, newCurrentLap: number) => void): void {
		if (liveInfo.currentLapDistance[carIndex] === undefined) {
			liveInfo.currentLapDistance[carIndex] = 1;
		}

		const currentLapDistance = carLapData.m_lapDistance;
		const currentLapNumber = carLapData.m_currentLapNum;

		if (currentLapDistance < liveInfo.currentLapDistance[carIndex]) {
			onLapComplete(carIndex, currentLapNumber);
		}

		liveInfo.currentLapDistance[carIndex] = currentLapDistance;
	}
}