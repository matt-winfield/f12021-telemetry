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
			for (const lapDistance in lap) {
				const lapData = lap[lapDistance];
				let nullCheckedData: SavedDataProperties = {
					worldPositionX: lapData.m_worldPositionX ?? 0,
					worldPositionY: lapData.m_worldPositionY ?? 0,
					worldPositionZ: lapData.m_worldPositionZ ?? 0,
					gForceLateral: lapData.m_gForceLateral ?? 0,
					gForceLongitudinal: lapData.m_gForceLongitudinal ?? 0,
					gForceVertical: lapData.m_gForceVertical ?? 0,
					currentLapTimeInMS: lapData.m_currentLapTimeInMS ?? 0,
					carPosition: lapData.m_carPosition ?? 0,
					driverStatus: lapData.m_driverStatus ?? 0,
					suspensionPosition: lapData.m_suspensionPosition ?? [0, 0, 0, 0],
					wheelSlip: lapData.m_wheelSlip ?? [0, 0, 0, 0],
					speed: lapData.m_speed ?? 0,
					throttle: lapData.m_throttle ?? 0,
					steering: lapData.m_steer ?? 0,
					brake: lapData.m_brake ?? 0,
					clutch: lapData.m_clutch ?? 0,
					gear: lapData.m_gear ?? 0,
					engineRPM: lapData.m_engineRPM ?? 0,
					drs: lapData.m_drs ?? 0
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
			.all(sessionUID, driverName, lapNumber) as { lapDistance: number, data: Buffer }[];

		db.close();

		let outputData: { [lapDistance: number]: SavedDataProperties } = {}
		lapData.forEach(dataPoint => {
			outputData[dataPoint.lapDistance] = this.binaryStorageParser.parse(dataPoint.data)
		});

		return outputData;
	}
}