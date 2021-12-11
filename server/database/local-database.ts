import SqliteDatabase from 'better-sqlite3';
import SessionData from '../models/session-data';
import BinaryStorageParser, { BinaryDataProperties } from './binary-storage-parser';

type LapInfo = {
	sessionUID: string,
	trackId: number,
	driverName: string,
	lapNumber: number
}

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
}