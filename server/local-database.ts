import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { CombinedCarData } from '../common/types/combined-car-data';
import CarData from './models/car-data';
import SessionData from './models/session-data';

type DatabaseData = {
	trackId: number;
	cars: { [carIndex: string]: DatabaseCarData };
}

type DatabaseCarData = {
	driverName: string;
	laps: { [lapNumber: string]: DatabaseLapData };
}

type DatabaseLapData = {
	[distance: string]: CombinedCarData
};

type MapCarDataResult = {
	data: DatabaseCarData;
	trackId?: number;
}

export default class LocalDatabase {
	public saveData(data: SessionData): void {
		// const trackData = this.mapSessionDataToDatabaseFormat(data);
		for (const carIndex in data.cars) {
			const carData = data.cars[carIndex];

			for (const lapNumber in carData.laps) {
				const lap = carData.laps[lapNumber];
				const db = new JsonDB(new Config(`db/${data.trackId}/${carData.driverName}/${lapNumber}`, false, false));
				db.push('/', lap, false);
				db.save();
			}
		}
	}

	// private mapSessionDataToDatabaseFormat(data: SessionData): DatabaseData {
	// 	const carsData: { [carId: string]: DatabaseCarData } = {};
	// 	let trackId: number | undefined;

	// 	for (const carData of data.carData) {
	// 		const mappedData = this.mapCarData(carData);
	// 		trackId = mappedData.trackId ?? 0;
	// 		carsData[carData.carIndex] = mappedData.data;
	// 	}

	// 	return {
	// 		trackId: trackId ?? 0,
	// 		cars: carsData
	// 	};
	// }

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
			const lapDistance = dataPoint.m_lapDistance
			const lapNumber = dataPoint.m_currentLapNum;
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

	private addDataToLap(lapNumber: number, lapDistance: number, dataPoint: CombinedCarData, outputCarData: DatabaseCarData): void {
		if (outputCarData.laps[lapNumber] === undefined) {
			outputCarData.laps[lapNumber] = { data: {} };
		}

		outputCarData.laps[lapNumber][lapDistance] = dataPoint;
	}
}