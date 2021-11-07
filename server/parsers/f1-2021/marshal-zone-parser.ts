import { Parser } from "binary-parser";

export default class MarshalZoneParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.floatle('m_zoneStart')
			.int8('m_zoneFlag');
	}
}