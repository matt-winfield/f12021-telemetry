import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import SessionData from '../models/session-data';
import BinaryStorageParser, { BinaryDataProperties } from './binary-storage-parser';

type OutputLapFormat = {
	sessionUID: string,
	data: { [lapDistance: number]: string }
}

export default class LocalDatabase {
	private binaryStorageParser: BinaryStorageParser = new BinaryStorageParser();

	public saveData = (data: SessionData, carIndex: number): void => {
		const carData = data.cars[carIndex];
		if (carData === undefined) return;

		for (const lapNumber in carData.laps) {
			const lap = carData.laps[lapNumber];

			const outputLap: OutputLapFormat = {
				sessionUID: data.sessionUID,
				data: {}
			};
			for (const lapDistance in lap) {
				const lapData = lap[lapDistance];
				let nullCheckedData: BinaryDataProperties = {
					m_worldPositionX: lapData.m_worldPositionX ?? 0,
					m_worldPositionY: lapData.m_worldPositionY ?? 0,
					m_worldPositionZ: lapData.m_worldPositionZ ?? 0,
					m_gForceLateral: lapData.m_gForceLateral ?? 0,
					m_gForceLongitudinal: lapData.m_gForceLongitudinal ?? 0,
					m_gForceVertical: lapData.m_gForceVertical ?? 0,
					m_currentLapTimeInMS: lapData.m_currentLapTimeInMS ?? 0,
					m_carPosition: lapData.m_carPosition ?? 0,
					m_driverStatus: lapData.m_driverStatus ?? 0,
					m_suspensionPosition: lapData.m_suspensionPosition ?? [0, 0, 0, 0],
					m_wheelSlip: lapData.m_wheelSlip ?? [0, 0, 0, 0]
				}

				const encodedData = this.binaryStorageParser.encodeBuffer(nullCheckedData);
				outputLap.data[lapDistance] = encodedData.toString('base64');
			}

			const db = new JsonDB(new Config(`db/${data.trackId}/${carData.driverName}/${data.sessionUID}-${lapNumber}`, false, false));
			db.push('/', outputLap, true);
			db.save();
		}
	}
}