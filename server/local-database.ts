import { JSONFile, Low } from 'lowdb';
import { join } from 'path';
import { CombinedData } from '../common/types/combined-data';
import CarData from './models/car-data';
import SessionData from './models/session-data';

type DatabaseData = {
	tracks: { [trackId: string]: DatabaseTrackData };
}

type DatabaseTrackData = {
	track: number;
	cars: { [carIndex: string]: DatabaseCarData };
}

type DatabaseCarData = {
	driverName: string;
	laps: { [lapNumber: string]: DatabaseLapData };
}

type DatabaseLapData = {
	data: { [distance: string]: CombinedData };
}

type MapCarDataResult = {
	data: DatabaseCarData;
	trackId?: number;
}

export default class LocalDatabase {
	private db: Low<DatabaseData>;
	private _isInitialised: boolean = false;

	public get isInitialised(): boolean {
		return this._isInitialised;
	}

	constructor() {
		const file = join(__dirname, 'db.json');
		const adapter = new JSONFile<DatabaseData>(file);
		this.db = new Low<DatabaseData>(adapter);
	}

	public async initialise(): Promise<void> {
		await this.db.read();
		this.db.data ||= { tracks: {} };
		this._isInitialised = true;
	}

	public async saveData(data: SessionData): Promise<void> {
		if (!this._isInitialised) {
			throw new Error("LocalDatabase not initialised");
		}

		const trackData = this.mapSessionDataToDatabaseFormat(data);
		this.db.data!.tracks = { ...this.db.data?.tracks, ...trackData };
		this.db.write();
	}

	private mapSessionDataToDatabaseFormat(data: SessionData): { [trackId: string]: DatabaseTrackData } {
		const trackData: { [trackId: string]: DatabaseTrackData } = {};

		for (const carData of data.carData) {
			this.mapCarData(carData);
		}

		return trackData;
	}

	private mapCarData(carData: CarData): MapCarDataResult {
		const outputCarData: DatabaseCarData = {
			driverName: carData.driverName,
			laps: {}
		};

		// Lap distance/number may not be sent at same time as other packets,
		// so keep track of the most recent one seen to group the packets by distance
		let currentLapDistance = 0;
		let currentLapNumber = 0;
		let trackId: number | undefined;
		for (const sessionTime in carData.data) {
			const dataPoint = carData.data[sessionTime];
			const lapDistance = dataPoint?.m_lapData?.[carData.carIndex].m_lapDistance;
			const lapNumber = dataPoint?.m_lapData?.[carData.carIndex].m_currentLapNum;
			trackId ||= dataPoint.m_trackId;

			if (lapDistance !== undefined) {
				currentLapDistance = lapDistance;
			}

			if (lapNumber !== undefined) {
				currentLapNumber = lapNumber;
			}

			this.addDataToLap(currentLapNumber, currentLapDistance, dataPoint, outputCarData);
		}

		return {
			data: outputCarData,
			trackId
		};
	}

	private addDataToLap(lapNumber: number, lapDistance: number, dataPoint: CombinedData, outputCarData: DatabaseCarData): void {
		if (outputCarData.laps[lapNumber] === undefined) {
			outputCarData.laps[lapNumber] = { data: {} };
		}

		outputCarData.laps[lapNumber].data[lapDistance] = dataPoint;
	}
}