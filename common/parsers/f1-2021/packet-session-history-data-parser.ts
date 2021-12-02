import { Parser } from "binary-parser";
import { PacketSessionHistoryData } from "../../types/packet-session-history-data";
import IPacketDataParser from "../ipacket-data-parser";
import PacketHeaderParser from "./packet-header-parser";

export default class PacketSessionHistoryDataParser extends Parser implements IPacketDataParser {
	constructor() {
		super();
		this.endianess('little')
			.nest('m_header', {
				type: new PacketHeaderParser()
			})
			.uint8('m_carIdx')
			.uint8('m_numLaps')
			.uint8('m_numTyreStints')
			.uint8('m_bestLapTimeLapNum')
			.uint8('m_bestSector1LapNum')
			.uint8('m_bestSector2LapNum')
			.uint8('m_bestSector3LapNum')
			.array('m_lapHistoryData', {
				type: new LapHistoryDataParser(),
				length: 100
			})
			.array('m_tyreStintHistoryData', {
				type: new TyreStintHistoryDataParser(),
				length: 8
			});
	}

	parseMessage(message: Buffer): PacketSessionHistoryData {
		return this.parse(message) as PacketSessionHistoryData;
	}
}

class LapHistoryDataParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint32('m_lapTimeInMS')
			.uint16('m_sector1TimeInMS')
			.uint16('m_sector2TimeInMS')
			.uint16('m_sector3TimeInMS')
			.uint8('m_lapValidBitFlags');
	}
}

class TyreStintHistoryDataParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint8('m_endLap')
			.uint8('m_tyreActualCompound')
			.uint8('m_tyreVisualCompound');
	}
}