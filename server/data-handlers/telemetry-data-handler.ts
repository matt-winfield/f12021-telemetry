import { PacketCarTelemetryData } from '../../common/types/packet-car-telemetry-data';
import DataManager from '../data-manager';
import SessionData from '../models/session-data';
import { CarCurrentLapData } from './lap-data-handler';

export default abstract class TelemetryDataHandler {
	public static addCarTelemetryData(message: PacketCarTelemetryData, sessionData: SessionData, currentLapData: (carIndex: number) => CarCurrentLapData) {
		message.m_carTelemetryData.forEach((carTelemetryData, carIndex) => {
			const currentLapNumber = currentLapData(carIndex).lapNumber;
			const currentLapDistance = currentLapData(carIndex).lapDistance;
			DataManager.prepareSessionData(sessionData, carIndex, currentLapNumber);

			sessionData.cars[carIndex].laps[currentLapNumber][currentLapDistance] = {
				...sessionData.cars[carIndex]?.laps?.[currentLapNumber]?.[currentLapDistance],
				m_speed: carTelemetryData.m_speed,
				m_throttle: carTelemetryData.m_throttle,
				m_steer: carTelemetryData.m_steer,
				m_brake: carTelemetryData.m_brake,
				m_clutch: carTelemetryData.m_clutch,
				m_gear: carTelemetryData.m_gear,
				m_engineRPM: carTelemetryData.m_engineRPM,
				m_drs: carTelemetryData.m_drs
			}
		})
	}
}