import { Parser } from "binary-parser";

export default class WeatherForecastSampleParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint8('m_sessionType')
			.uint8('m_timeOffset')
			.uint8('m_weather')
			.int8('m_trackTemperature')
			.int8('m_trackTemperatureChange')
			.int8('m_airTemperature')
			.int8('m_airTemperatureChange')
			.uint8('m_rainPercentage');
	}
}