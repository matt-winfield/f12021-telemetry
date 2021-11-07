import { Parser } from "binary-parser";
import { PacketSessionData } from "../../../common/types/packet-session-data";
import MarshalZoneParser from "./marshal-zone-parser";
import PacketHeaderParser from "./packet-header-parser";
import WeatherForecastSampleParser from "./weather-forecast-sample-parser";

export default class PacketSessionDataParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.nest('m_header', {
				type: new PacketHeaderParser()
			})
			.uint8('m_weather')
			.int8('m_trackTemperature')
			.int8('m_airTemperature')
			.uint8('m_totalLaps')
			.uint16('m_trackLength')
			.uint8('m_sessionType')
			.int8('m_trackId')
			.uint8('m_formula')
			.uint16('m_sessionTimeLeft')
			.uint16('m_sessionDuration')
			.uint8('m_pitSpeedLimit')
			.uint8('m_gamePaused')
			.uint8('m_isSpectating')
			.uint8('m_specatorCarIndex')
			.uint8('m_sliProNativeSupport')
			.uint8('m_numMarshalZones')
			.array('m_marshalZones', {
				type: new MarshalZoneParser(),
				length: 21
			})
			.uint8('m_safetyCarStatus')
			.uint8('m_networkGame')
			.uint8('m_numWeatherForecastSamples')
			.array('m_weatherForecastSamples', {
				type: new WeatherForecastSampleParser(),
				length: 56
			})
			.uint8('m_forecastAccuracy')
			.uint8('m_aiDifficulty')
			.uint32('m_seasonLinkIdentifier')
			.uint32('m_weekendLinkIdentifier')
			.uint32('m_sessionLinkIdentifier')
			.uint8('m_pitStopWindowIdealLap')
			.uint8('m_pitStopWindowLatestLap')
			.uint8('m_pitStopRejoinPosition')
			.uint8('m_steeringAssist')
			.uint8('m_brakingAssist')
			.uint8('m_gearboxAssist')
			.uint8('m_pitAssist')
			.uint8('m_pitReleaseAssist')
			.uint8('m_ERSAssist')
			.uint8('m_DRSAssist')
			.uint8('m_dynamicRacingLine')
			.uint8('m_dynamicRacingLineType');
	}

	public parseMessage(message: Buffer): PacketSessionData {
		return this.parse(message) as PacketSessionData;
	}
}