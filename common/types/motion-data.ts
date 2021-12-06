export type MotionData = {
	m_worldPositionX: number;
	m_worldPositionY: number;
	m_worldPositionZ: number;
	m_worldVelocityX: number;
	m_worldVelocityY: number;
	m_worldVelocityZ: number;
	m_worldForwardDirX: number;
	m_worldForwardDirY: number;
	m_worldForwardDirZ: number;
	m_worldRightDirX: number;
	m_worldRightDirY: number;
	m_worldRightDirZ: number;
	m_gForceLateral: number;
	m_gForceLongitudinal: number;
	m_gForceVertical: number;
	m_yaw: number;
	m_pitch: number;
	m_roll: number;
}

export type PlayerMotionData = {
	m_suspensionPosition: number[];
	m_suspensionVelocity: number[];
	m_suspensionAcceleration: number[];
	m_wheelSpeed: number[];
	m_wheelSlip: number[];
	m_localVelocityX: number;
	m_localVelocityY: number;
	m_localVelocityZ: number;
	m_angularVelocityX: number;
	m_angularVelocityY: number;
	m_angularVelocityZ: number;
	m_angularAccelerationX: number;
	m_angularAccelerationY: number;
	m_angularAccelerationZ: number;
	m_frontWheelsAngle: number;
}