import { CombinedCarData } from "../../common/types/combined-car-data";

export default class SessionData {
	public cars: {
		[carIndex: number]: {
			driverName: string,
			laps: {
				[lapNumber: number]: {
					[lapDistance: number]: CombinedCarData
				}
			}
		}
	};
	public trackId: number = -1;

	constructor() {
		this.cars = {};
	}
}