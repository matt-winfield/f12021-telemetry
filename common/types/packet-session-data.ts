import { MarshalZone } from "./marshal-zone";
import { PacketHeader } from "./packet-header";
import { WeatherForecastSample } from "./weather-forecast-sample";

export type PacketSessionData = {
	m_header: PacketHeader;
} & SessionData;

export type SessionData = {
	m_weather: number;
	m_trackTemperature: number;
	m_airTemperature: number;
	m_totalLaps: number;
	m_trackLength: number;
	m_sessionType: number;
	m_trackId: number;
	m_formula: number;
	m_sessionTimeLeft: number;
	m_sessionDuration: number;
	m_pitSpeedLimit: number;
	m_gamePaused: number;
	m_isSpectating: number;
	m_spectatorCarIndex: number;
	m_sliProNativeSupport: number;
	m_numMarshalZones: number;
	m_marshalZones: MarshalZone[];
	m_safetyCarStatus: number;
	m_networkGame: number;
	m_numWeatherForecastSamples: number;
	m_weatherForecastSamples: WeatherForecastSample[];
	m_forecastAccuracy: number;
	m_aiDifficulty: number;
	m_seasonLinkIdentifier: number;
	m_weekendLinkIdentifier: number;
	m_sessionLinkIdentifier: number;
	m_pitStopWindowIdealLap: number;
	m_pitStopWindowLatestLap: number;
	m_pitStopRejoinPosition: number;
	m_steeringAssist: number;
	m_brakingAssist: number;
	m_gearboxAssist: number;
	m_pitAssist: number;
	m_pitReleaseAssist: number;
	m_ERSAssist: number;
	m_DRSAssist: number;
	m_dynamicRacingLine: number;
	m_dynamicRacingLineType: number;
}