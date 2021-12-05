import { PacketMotionData } from "../../common/types/packet-motion-data";
import DataManager from "../data-manager";
import SessionData from "../models/session-data";

export default abstract class MotionDataHandler {
	public static addMotionData(message: PacketMotionData, data: SessionData): void {
		const frameId = message.m_header.m_frameIdentifier;
		this.addCarMotionData(message, data, frameId);
		this.addPlayerMotionData(message, data, frameId);

	}

	private static addCarMotionData(message: PacketMotionData, data: SessionData, frameId: number): void {
		message.m_carMotionData.forEach((carMotionData, carIndex) => {
			DataManager.prepareData(data, frameId, carIndex);
			data.carData[carIndex].data[frameId] = { ...data.carData[carIndex].data[frameId], ...carMotionData };
		});
	}

	private static addPlayerMotionData(message: PacketMotionData, data: SessionData, frameId: number): void {
		const playerCarIndex = message.m_header.m_playerCarIndex;
		DataManager.prepareData(data, frameId, playerCarIndex);
		data.carData[playerCarIndex].data[frameId] = {
			...data.carData[playerCarIndex].data[frameId],
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