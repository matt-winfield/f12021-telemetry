import SqliteDatabase from 'better-sqlite3';
import { LapData, LapInfo } from '../../common/model/lap-info';
import { SavedDataProperties } from '../../common/model/saved-data-properties';
import SessionData from '../models/session-data';
import BinaryStorageParser from './binary-storage-parser';

export default class LocalDatabase {
	private readonly DB_NAME: string = 'db.sqlite';
	private binaryStorageParser: BinaryStorageParser = new BinaryStorageParser();

	constructor() {
		const db = new SqliteDatabase(this.DB_NAME);
		db.pragma('journal_mode = WAL');

		db.prepare(`CREATE TABLE IF NOT EXISTS Lap (sessionUID TEXT, trackId INTEGER, driverName TEXT, lapNumber INTEGER,
		PRIMARY KEY (sessionUID, trackId, driverName, lapNumber))`).run();

		db.prepare(`CREATE TABLE IF NOT EXISTS LapData (sessionUID TEXT, trackId INTEGER, driverName TEXT, lapNumber INTEGER, lapDistance INTEGER, data BLOB,
		PRIMARY KEY (sessionUID, trackId, driverName, lapNumber, lapDistance),
		FOREIGN KEY (sessionUID, trackId, driverName, lapNumber) REFERENCES Lap (sessionUID, trackId, driverName, lapNumber)
		ON DELETE CASCADE)`).run();

		db.close();
	}

	public saveData = (data: SessionData, carIndex: number, lapNumber: number): void => {
		const db = new SqliteDatabase(this.DB_NAME);
		db.pragma('journal_mode = WAL');
		const createLapStatement = db.prepare('INSERT OR REPLACE INTO Lap VALUES (?, ?, ?, ?)');
		const addLapDataStatement = db.prepare('INSERT OR REPLACE INTO LapData VALUES (?, ?, ?, ?, ?, ?)');

		const carData = data.cars[carIndex];
		if (carData === undefined) return;

		const lap = carData.laps[lapNumber];

		createLapStatement.run(data.sessionUID, data.trackId, carData.driverName, lapNumber);

		const insertLapData = db.transaction(() => {
			let currentLapData: Partial<SavedDataProperties> = {}

			for (const lapDistance in lap) {
				const lapData = lap[lapDistance];

				currentLapData = {
					worldPositionX: lapData.m_worldPositionX ?? currentLapData.worldPositionX,
					worldPositionY: lapData.m_worldPositionY ?? currentLapData.worldPositionY,
					worldPositionZ: lapData.m_worldPositionZ ?? currentLapData.worldPositionZ,
					gForceLateral: lapData.m_gForceLateral ?? currentLapData.gForceLateral,
					gForceLongitudinal: lapData.m_gForceLongitudinal ?? currentLapData.gForceLongitudinal,
					gForceVertical: lapData.m_gForceVertical ?? currentLapData.gForceVertical,
					currentLapTimeInMS: lapData.m_currentLapTimeInMS ?? currentLapData.currentLapTimeInMS,
					carPosition: lapData.m_carPosition ?? currentLapData.carPosition,
					driverStatus: lapData.m_driverStatus ?? currentLapData.driverStatus,
					suspensionPosition: lapData.m_suspensionPosition ?? currentLapData.suspensionPosition,
					wheelSlip: lapData.m_wheelSlip ?? currentLapData.wheelSlip,
					speed: lapData.m_speed ?? currentLapData.speed,
					throttle: lapData.m_throttle ?? currentLapData.throttle,
					steering: lapData.m_steer ?? currentLapData.throttle,
					brake: lapData.m_brake ?? currentLapData.brake,
					clutch: lapData.m_clutch ?? currentLapData.clutch,
					gear: lapData.m_gear ?? currentLapData.gear,
					engineRPM: lapData.m_engineRPM ?? currentLapData.engineRPM,
					drs: lapData.m_drs ?? currentLapData.drs
				}

				let nullCheckedData: SavedDataProperties = {
					worldPositionX: currentLapData.worldPositionX ?? 0,
					worldPositionY: currentLapData.worldPositionY ?? 0,
					worldPositionZ: currentLapData.worldPositionZ ?? 0,
					gForceLateral: currentLapData.gForceLateral ?? 0,
					gForceLongitudinal: currentLapData.gForceLongitudinal ?? 0,
					gForceVertical: currentLapData.gForceVertical ?? 0,
					currentLapTimeInMS: currentLapData.currentLapTimeInMS ?? 0,
					carPosition: currentLapData.carPosition ?? 0,
					driverStatus: currentLapData.driverStatus ?? 0,
					suspensionPosition: currentLapData.suspensionPosition ?? [0, 0, 0, 0],
					wheelSlip: currentLapData.wheelSlip ?? [0, 0, 0, 0],
					speed: currentLapData.speed ?? 0,
					throttle: currentLapData.throttle ?? 0,
					steering: currentLapData.steering ?? 0,
					brake: currentLapData.brake ?? 0,
					clutch: currentLapData.clutch ?? 0,
					gear: currentLapData.gear ?? 0,
					engineRPM: currentLapData.engineRPM ?? 0,
					drs: currentLapData.drs ?? 0
				}

				const encodedData = this.binaryStorageParser.encodeBuffer(nullCheckedData);
				addLapDataStatement.run(data.sessionUID, data.trackId, carData.driverName, lapNumber, lapDistance, encodedData);
			}
		});
		insertLapData();
		db.close();
	}

	public getTracks = (): number[] => {
		const db = new SqliteDatabase(this.DB_NAME);
		const data = db.prepare('SELECT DISTINCT trackId FROM Lap').pluck().all() as number[];
		db.close();
		return data;
	};

	public getLapsByTrackId = (trackId: number): LapInfo[] => {
		const db = new SqliteDatabase(this.DB_NAME);
		const data = db.prepare('SELECT * FROM Lap WHERE trackId = ?').all(trackId) as LapInfo[];
		db.close();
		return data;
	}

	public getLapsByDriverName = (driverName: string): LapInfo[] => {
		const db = new SqliteDatabase(this.DB_NAME);
		const data = db.prepare('SELECT * FROM Lap WHERE driverName = ?').all(driverName) as LapInfo[];
		db.close();
		return data;
	}

	public getLapsByTrackAndDriver = (trackId: number, driverName: string): LapInfo[] => {
		const db = new SqliteDatabase(this.DB_NAME);
		const data = db.prepare('SELECT * FROM Lap WHERE trackId = ? AND driverName = ?').all(trackId, driverName) as LapInfo[];
		db.close();
		return data;
	}

	public getLapData = (sessionUID: string, driverName: string, lapNumber: number): LapData => {
		const db = new SqliteDatabase(this.DB_NAME);
		const lapData = db.prepare('SELECT * FROM LapData WHERE sessionUID = ? AND driverName = ? AND lapNumber = ?')
			.all(sessionUID, driverName, lapNumber) as { trackId: number, lapDistance: number, data: Buffer }[];

		db.close();

		let outputData: { [lapDistance: number]: SavedDataProperties } = {}
		lapData.forEach(dataPoint => {
			outputData[dataPoint.lapDistance] = this.binaryStorageParser.parse(dataPoint.data)
		});

		return {
			lapInfo: {
				trackId: lapData[0].trackId,
				sessionUID,
				driverName,
				lapNumber
			},
			data: outputData
		};
	}
}