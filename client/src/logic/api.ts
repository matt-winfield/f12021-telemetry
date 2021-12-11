import { LapData, LapInfo } from '../../../common/model/lap-info';

export default abstract class Api {
	private static readonly baseApi = 'http://localhost:3001';

	public static fetchTracks = async (): Promise<number[]> => {
		const response = await fetch(`${this.baseApi}/tracks`);
		if (!response.ok) {
			throw new Error('Response was not OK');
		}
		return response.json();
	}

	public static fetchTrackLaps = async (trackId: number): Promise<LapInfo[]> => {
		const response = await fetch(`${this.baseApi}/laps?trackId=${trackId}`);
		if (!response.ok) {
			throw new Error('Response was not OK');
		}
		return response.json();
	}

	public static fetchLapData = async (sessionUID: string, driverName: string, lapNumber: number): Promise<LapData> => {
		const response = await fetch(`${this.baseApi}/lapData?sessionUID=${sessionUID}&driverName=${driverName}&lapNumber=${lapNumber}`);
		if (!response.ok) {
			throw new Error('Response was not OK');
		}
		return response.json();
	}
}