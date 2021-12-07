import { PacketMotionData } from "../../common/types/packet-motion-data";
import DataManager from "../data-manager";
import SessionData from "../models/session-data";
import { CarCurrentLapData } from "./lap-data-handler";

export default abstract class MotionDataHandler {
	public static addMotionData(message: PacketMotionData, data: SessionData, currentLapData: (carIndex: number) => CarCurrentLapData): void {
		const sessionTime = message.m_header.m_sessionTime;
		this.addCarMotionData(message, data, sessionTime, currentLapData);
		this.addPlayerMotionData(message, data, sessionTime, currentLapData);
	}

	private static addCarMotionData(message: PacketMotionData, data: SessionData, sessionTime: number, currentLapData: (carIndex: number) => CarCurrentLapData): void {
		message.m_carMotionData.forEach((carMotionData, carIndex) => {
			const currentLapNumber = currentLapData(carIndex).lapNumber;
			DataManager.prepareSessionData(data, carIndex, currentLapNumber);
			data.cars[carIndex].laps[currentLapNumber][sessionTime] = { ...data.cars[carIndex]?.laps?.[currentLapNumber]?.[sessionTime], ...carMotionData }
			data.cars[carIndex].driverName = carIndex.toString();;
		});
	}

	private static addPlayerMotionData(message: PacketMotionData, data: SessionData, sessionTime: number, currentLapData: (carIndex: number) => CarCurrentLapData): void {
		const playerCarIndex = message.m_header.m_playerCarIndex;
		const currentLapNumber = currentLapData(playerCarIndex).lapNumber;
		DataManager.prepareSessionData(data, playerCarIndex, currentLapNumber);

		data.cars[playerCarIndex].laps[currentLapNumber][sessionTime] = {
			...data.cars[playerCarIndex].laps[currentLapNumber][sessionTime],
			m_suspensionPosition: message.m_suspensionPosition,
			m_suspensionVelocity: message.m_suspensionVelocity,
			m_suspensionAcceleration: message.m_suspensionAcceleration,
			m_wheelSpeed: message.m_wheelSpeed,
			m_wheelSlip: message.m_wheelSlip,
			m_localVelocityX: message.m_localVelocityX,
			m_localVelocityY: message.m_localVelocityY,
			m_localVelocityZ: message.m_localVelocityZ,
			m_angularVelocityX: message.m_localVelocityX,
			m_angularVelocityY: message.m_localVelocityY,
			m_angularVelocityZ: message.m_localVelocityZ,
			m_angularAccelerationX: message.m_angularAccelerationX,
			m_angularAccelerationY: message.m_angularAccelerationY,
			m_angularAccelerationZ: message.m_angularAccelerationZ,
			m_frontWheelsAngle: message.m_frontWheelsAngle
		};
	}
}