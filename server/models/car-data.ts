import { CombinedCarData } from '../../common/types/combined-car-data';

export default class CarData {
	public driverName: string = '';
	public carIndex: number = -1;
	public data: { [sessionTime: number]: CombinedCarData } = {};
}
