import { PacketMotionData } from "../../common/types/packet-motion-data";
import DataManager from "../data-manager";
import SessionData from "../models/session-data";
import { CarCurrentLapData } from "./lap-data-handler";

export default abstract class MotionDataHandler {
	public static addMotionData(message: PacketMotionData, data: SessionData, currentLapData: (carIndex: number) => CarCurrentLapData): void {
		this.addCarMotionData(message, data, currentLapData);
		this.addPlayerMotionData(message, data, currentLapData);
	}

	private static addCarMotionData(message: PacketMotionData, data: SessionData, currentLapData: (carIndex: number) => CarCurrentLapData): void {
		message.m_carMotionData.forEach((carMotionData, carIndex) => {
			const currentLapNumber = currentLapData(carIndex).lapNumber;
			const currentLapDistance = currentLapData(carIndex).lapDistance;
			DataManager.prepareSessionData(data, carIndex, currentLapNumber);
			data.cars[carIndex].laps[currentLapNumber][currentLapDistance] = {
				...data.cars[carIndex]?.laps?.[currentLapNumber]?.[currentLapDistance],
				m_worldPositionX: carMotionData.m_worldPositionX,
				m_worldPositionY: carMotionData.m_worldPositionY,
				m_worldPositionZ: carMotionData.m_worldPositionZ,
				m_gForceLateral: carMotionData.m_gForceLateral,
				m_gForceLongitudinal: carMotionData.m_gForceLongitudinal,
				m_gForceVertical: carMotionData.m_gForceVertical
			}
			data.cars[carIndex].driverName = carIndex.toString();
		});
	}

	private static addPlayerMotionData(message: PacketMotionData, data: SessionData, currentLapData: (carIndex: number) => CarCurrentLapData): void {
		const playerCarIndex = message.m_header.m_playerCarIndex;
		const currentLapNumber = currentLapData(playerCarIndex).lapNumber;
		const currentLapDistance = currentLapData(playerCarIndex).lapDistance;
		DataManager.prepareSessionData(data, playerCarIndex, currentLapNumber);

		data.cars[playerCarIndex].laps[currentLapNumber][currentLapDistance] = {
			...data.cars[playerCarIndex].laps[currentLapNumber][currentLapDistance],
			m_suspensionPosition: message.m_suspensionPosition,
			m_wheelSpeed: message.m_wheelSpeed,
			m_wheelSlip: message.m_wheelSlip,
			m_frontWheelsAngle: message.m_frontWheelsAngle
		};
	}
}