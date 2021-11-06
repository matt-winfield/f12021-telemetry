import { Parser } from "binary-parser";

export default class MotionDataParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.floatle('m_worldPositionX')
			.floatle('m_worldPositionY')
			.floatle('m_worldPositionZ')
			.floatle('m_worldVelocityX')
			.floatle('m_worldVelocityY')
			.floatle('m_worldVelocityZ')
			.int16('m_worldForwardDirX')
			.int16('m_worldForwardDirY')
			.int16('m_worldForwardDirZ')
			.int16('m_worldRightDirX')
			.int16('m_worldRightDirY')
			.int16('m_worldRightDirZ')
			.floatle('m_gForceLateral')
			.floatle('m_gForceLongitudinal')
			.floatle('m_gForceVertical')
			.floatle('m_yaw')
			.floatle('m_pitch')
			.floatle('m_roll')
	}
}

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