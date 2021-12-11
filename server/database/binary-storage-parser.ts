import { Parser } from 'binary-parser-encoder';
import { SavedDataProperties } from '../../common/model/saved-data-properties';

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

	public encodeBuffer = (object: SavedDataProperties): Buffer => {
		return this.encode(object) as Buffer;
	}
}