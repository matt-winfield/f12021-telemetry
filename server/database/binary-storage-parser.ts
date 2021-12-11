import { Parser } from 'binary-parser-encoder';
import { SavedDataProperties } from '../../common/model/saved-data-properties';

export default class BinaryStorageParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.floatle('worldPositionX')
			.floatle('worldPositionY')
			.floatle('worldPositionZ')
			.floatle('gForceLateral')
			.floatle('gForceLongitudinal')
			.floatle('gForceVertical')
			.uint32('currentLapTimeInMS')
			.array('suspensionPosition', {
				type: 'floatle',
				length: 4
			})
			.array('wheelSlip', {
				type: 'floatle',
				length: 4
			})
			.uint8('carPosition')
			.uint8('driverStatus')
			.uint16('speed')
			.floatle('throttle')
			.floatle('steering')
			.floatle('brake')
			.uint8('clutch')
			.int8('gear')
			.uint16('engineRPM')
			.uint8('drs');
	}

	public encodeBuffer = (object: SavedDataProperties): Buffer => {
		return this.encode(object) as Buffer;
	}
}