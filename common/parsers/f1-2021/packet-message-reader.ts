import { PacketIds } from "../../../common/constants/packet-ids";
import { Message } from "../../../common/types/message";
import IPacketDataParser from "../ipacket-data-parser";
import PacketEventDataParser from "./packet-event-data-parser";
import PacketHeaderParser from "./packet-header-parser";
import PacketLapDataParser from "./packet-lap-data-parser";
import PacketMotionDataParser from "./packet-motion-data-parser";
import PacketSessionDataParser from "./packet-session-data-parser";

export default class PacketMessageReader {
	private static readonly parsers: { [key in PacketIds]?: IPacketDataParser } = {
		[PacketIds.Motion]: new PacketMotionDataParser(),
		[PacketIds.Session]: new PacketSessionDataParser(),
		[PacketIds.LapData]: new PacketLapDataParser(),
		[PacketIds.Event]: new PacketEventDataParser()
	}

	public static readMessage(message: Buffer): Message | undefined {
		let header = new PacketHeaderParser().parseHeader(message);

		let parser = this.parsers[header.m_packetId as PacketIds];
		if (parser) {
			return parser.parseMessage(message);
		}

		return undefined;
	}
}