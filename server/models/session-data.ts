import { CombinedCarData } from "../../common/types/combined-car-data";

export type Lap = {
	[lapNumber: number]: {
		[lapDistance: number]: CombinedCarData
	}
}

export default class SessionData {
	public trackId: number = -1;
	public sessionUID: string = '';
	public trackLength: number = 0;
	public cars: {
		[carIndex: number]: {
			driverName: string,
			aiControlled: boolean,
			laps: Lap
		}
	};

	constructor() {
		this.cars = {};
	}
}