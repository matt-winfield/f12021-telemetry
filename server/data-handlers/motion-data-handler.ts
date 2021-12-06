import { PacketMotionData } from "../../common/types/packet-motion-data";
import DataManager from "../data-manager";
import SessionData from "../models/session-data";

export default abstract class MotionDataHandler {
	public static addMotionData(message: PacketMotionData, data: SessionData): void {
		const sessionTime = message.m_header.m_sessionTime;
		this.addCarMotionData(message, data, sessionTime);
		this.addPlayerMotionData(message, data, sessionTime);

	}

	private static addCarMotionData(message: PacketMotionData, data: SessionData, sessionTime: number): void {
		message.m_carMotionData.forEach((carMotionData, carIndex) => {
			DataManager.prepareData(data, sessionTime, carIndex);
			data.carData[carIndex].data[sessionTime] = { ...data.carData[carIndex].data[sessionTime], ...carMotionData };
			data.carData[carIndex].carIndex = carIndex;
		});
	}

	private static addPlayerMotionData(message: PacketMotionData, data: SessionData, sessionTime: number): void {
		const playerCarIndex = message.m_header.m_playerCarIndex;
		DataManager.prepareData(data, sessionTime, playerCarIndex);
		data.carData[playerCarIndex].data[sessionTime] = {
			...data.carData[playerCarIndex].data[sessionTime],
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
		}
	}
}