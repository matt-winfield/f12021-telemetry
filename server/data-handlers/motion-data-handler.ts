import { roundToDecimalPlaces } from '../../common/helpers/number-helpers';
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
				m_worldPositionX: roundToDecimalPlaces(carMotionData.m_worldPositionX, 3),
				m_worldPositionY: roundToDecimalPlaces(carMotionData.m_worldPositionY, 3),
				m_worldPositionZ: roundToDecimalPlaces(carMotionData.m_worldPositionZ, 3),
				m_gForceLateral: roundToDecimalPlaces(carMotionData.m_gForceLateral, 3),
				m_gForceLongitudinal: roundToDecimalPlaces(carMotionData.m_gForceLongitudinal, 3),
				m_gForceVertical: roundToDecimalPlaces(carMotionData.m_gForceVertical, 3)
			}
		});
	}

	private static addPlayerMotionData(message: PacketMotionData, data: SessionData, currentLapData: (carIndex: number) => CarCurrentLapData): void {
		const playerCarIndex = message.m_header.m_playerCarIndex;
		const currentLapNumber = currentLapData(playerCarIndex).lapNumber;
		const currentLapDistance = currentLapData(playerCarIndex).lapDistance;
		DataManager.prepareSessionData(data, playerCarIndex, currentLapNumber);

		data.cars[playerCarIndex].laps[currentLapNumber][currentLapDistance] = {
			...data.cars[playerCarIndex].laps[currentLapNumber][currentLapDistance],
			m_suspensionPosition: message.m_suspensionPosition.map(x => roundToDecimalPlaces(x, 4)),
			m_wheelSpeed: message.m_wheelSpeed.map(x => roundToDecimalPlaces(x, 1)),
			m_wheelSlip: message.m_wheelSlip.map(x => roundToDecimalPlaces(x, 4)),
			m_frontWheelsAngle: message.m_frontWheelsAngle
		};
	}
}