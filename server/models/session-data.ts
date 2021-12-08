import { CombinedCarData } from "../../common/types/combined-car-data";

export default class SessionData {
	public trackId: number = -1;
	public sessionUID: string = '';
	public trackLength: number = 0;
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

	constructor() {
		this.cars = {};
	}
}