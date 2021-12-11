export default abstract class Api {
	private static readonly baseApi = 'http://localhost:3001';

	public static fetchTracks = async (): Promise<number[]> => {
		const response = await fetch(`${this.baseApi}/tracks`);
		if (!response.ok) {
			throw new Error('Response was not OK');
		}
		return response.json();
	}
}