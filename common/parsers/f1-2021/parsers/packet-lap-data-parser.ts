import { Parser } from "binary-parser";
import LapDataParser from "./lap-data-parser";
import PacketHeaderParser from "./packet-header-parser";
import { PacketLapData } from '../../../../common/types/packet-lap-data';
import IPacketDataParser from "./ipacket-data-parser";

export default class PacketLapDataParser extends Parser implements IPacketDataParser {
	constructor() {
		super();
		this.endianess('little')
			.nest('m_header', {
				type: new PacketHeaderParser()
			})
			.array('m_lapData', {
				type: new LapDataParser(),
				length: 22
			})
	}

	public parseMessage(message: Buffer): PacketLapData {
		return this.parse(message) as PacketLapData;
	}
}