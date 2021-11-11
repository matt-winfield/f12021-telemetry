export type CarTelemetryData = {
	m_speed: number;
	m_throttle: number;
	m_steer: number;
	m_brake: number;
	m_clutch: number;
	m_gear: number;
	m_engineRPM: number;
	m_drs: number;
	m_revLightsPercent: number;
	m_revLightsBitValue: number;
	m_brakesTemperature: number[];
	m_tyresSurfaceTemperature: number[];
	m_tyresInnerTemperature: number[];
	m_engineTemperature: number;
	m_tyresPressure: number[];
	m_surfaceType: number[];
}