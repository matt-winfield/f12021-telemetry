export default class SocketDataFormatter {
	public static formatData(message: any) {
		return JSON.stringify(message, (key, value) =>
			typeof value === 'bigint'
				? value.toString()
				: value
		)
	}
}