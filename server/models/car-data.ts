import { CombinedData } from '../../common/types/combined-data';

export default class CarData {
	public driverName: string = '';
	public carIndex: number = -1;
	public data: { [sessionTime: number]: CombinedData } = {};
}