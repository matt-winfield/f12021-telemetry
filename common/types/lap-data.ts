export type LapData = {
	m_lastLapTimeInMS: number;
	m_currentLapTimeInMS: number;
	m_sector1TimeInMS: number;
	m_sector2TimeInMS: number;
	m_lapDistance: number;
	m_totalDistance: number;
	m_safetyCarDelta: number;
	m_carPosition: number;
	m_currentLapNum: number;
	m_pitStatus: number;
	m_numPitStops: number;
	m_sector: number;
	m_currentLapInvalid: number;
	m_penalties: number;
	m_warnings: number;
	m_numUnservedDriveThroughPens: number;
	m_numUnservedStopGoPens: number;
	m_gridPosition: number;
	m_driverStatus: number;
	m_resultStatus: number;
	m_pitLaneTimerActive: number;
	m_pitLaneTimerInLaneInMS: number;
	m_pitStoptimerInMS: number;
	m_pitStopShouldServePen: number;
}