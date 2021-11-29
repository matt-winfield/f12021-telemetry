import { Parser } from "binary-parser";
import { PacketFinalClassificationData } from "../../types/packet-final-classification-data";
import IPacketDataParser from "../ipacket-data-parser";
import PacketHeaderParser from "./packet-header-parser";

export default class PacketFinalClassificationDataParser extends Parser implements IPacketDataParser {
	constructor() {
		super();
		this.endianess('little')
			.nest('m_header', {
				type: new PacketHeaderParser()
			})
			.uint8('m_numCars')
			.array('m_classificationData', {
				type: new FinalClassificationDataParser(),
				length: 22
			})
	}

	parseMessage(message: Buffer): PacketFinalClassificationData {
		return this.parse(message) as PacketFinalClassificationData;
	}
}

class FinalClassificationDataParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint8('m_position')
			.uint8('m_numLaps')
			.uint8('m_gridPosition')
			.uint8('m_points')
			.uint8('m_numPitStops')
			.uint8('m_resultStatus')
			.uint32('m_bestLapTimeInMS')
			.doublele('m_totalRaceTime')
			.uint8('m_penaltiesTime')
			.uint8('m_numPenalties')
			.uint8('m_numTyreStints')
			.array('m_tyreStintsActual', {
				type: 'uint8',
				length: 8
			})
			.array('m_tyreStintsVisual', {
				type: 'uint8',
				length: 8
			})
	}
}