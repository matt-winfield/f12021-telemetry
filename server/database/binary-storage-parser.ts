import { Parser } from 'binary-parser-encoder';

export type BinaryDataProperties = {
	m_worldPositionX: number;
	m_worldPositionY: number;
	m_worldPositionZ: number;
	m_gForceLateral: number;
	m_gForceLongitudinal: number;
	m_gForceVertical: number;
	m_currentLapTimeInMS: number;
	m_suspensionPosition: number[];
	m_wheelSlip: number[];
	m_carPosition: number;
	m_driverStatus: number;
}

export default class BinaryStorageParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.floatle('m_worldPositionX')
			.floatle('m_worldPositionY')
			.floatle('m_worldPositionZ')
			.floatle('m_gForceLateral')
			.floatle('m_gForceLongitudinal')
			.floatle('m_gForceVertical')
			.uint32('m_currentLapTimeInMS')
			.array('m_suspensionPosition', {
				type: 'floatle',
				length: 4
			})
			.array('m_wheelSlip', {
				type: 'floatle',
				length: 4
			})
			.uint8('m_carPosition')
			.uint8('m_driverStatus');
	}

	public encodeBuffer = (object: BinaryDataProperties): Buffer => {
		return this.encode(object) as Buffer;
	}
}