import { PacketIds } from "../../../common/constants/packet-ids";
import { Message } from "../../../common/types/message";
import PacketHeaderParser from "./packet-header-parser";
import PacketLapDataParser from "./packet-lap-data-parser";
import PacketMotionDataParser from "./packet-motion-data-parser";
import PacketSessionDataParser from "./packet-session-data-parser";

export default class PacketMessageReader {
	public static readMessage(message: Buffer): Message | undefined {
		let header = new PacketHeaderParser().parseHeader(message);

		switch (header.m_packetId) {
			case PacketIds.Motion:
				return new PacketMotionDataParser().parseMessage(message);
			case PacketIds.Session:
				return new PacketSessionDataParser().parseMessage(message);
			case PacketIds.LapData:
				return new PacketLapDataParser().parseMessage(message);
		}

		return undefined;
	}
}