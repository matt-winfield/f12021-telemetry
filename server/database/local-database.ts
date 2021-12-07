import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import SessionData from '../models/session-data';
import BinaryStorageParser from './binary-storage-parser';

export default class LocalDatabase {
	private binaryStorageParser: BinaryStorageParser = new BinaryStorageParser();

	public saveData = (data: SessionData): void => {
		for (const carIndex in data.cars) {
			const carData = data.cars[carIndex];

			for (const lapNumber in carData.laps) {
				const lap = carData.laps[lapNumber];

				const outputLap: { [lapDistance: number]: string } = {};
				for (const lapDistance in lap) {
					try {
						const encodedData = this.binaryStorageParser.encodeBuffer(lap[lapDistance]);
						this.binaryStorageParser.parse(encodedData); // Incomplete data will throw exception so won't be recorded

						outputLap[lapDistance] = encodedData.toString('base64');
					} catch { }

				}

				const db = new JsonDB(new Config(`db/${data.trackId}/${carData.driverName}/${lapNumber}`, false, false));
				db.push('/', outputLap, true);
				db.save();
			}
		}
	}
}