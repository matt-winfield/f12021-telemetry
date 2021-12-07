import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import SessionData from './models/session-data';

export default class LocalDatabase {
	public saveData(data: SessionData): void {
		for (const carIndex in data.cars) {
			const carData = data.cars[carIndex];

			for (const lapNumber in carData.laps) {
				const lap = carData.laps[lapNumber];
				const db = new JsonDB(new Config(`db/${data.trackId}/${carData.driverName}/${lapNumber}`, false, false));
				db.push('/', lap, true);
				db.save();
			}
		}
	}
}