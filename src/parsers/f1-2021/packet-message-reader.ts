import { PacketIds } from "../../constants/packet-ids";
import HeaderParser from "./header-parser";
import PacketMotionDataParser, { PacketMotionData } from "./packet-motion-data-parser";

export default class PacketMessageReader {
	public static readMessage(message: Buffer): Message | undefined {
		let header = new HeaderParser().parseHeader(message);

		switch (header.m_packetId) {
			case PacketIds.Motion:
				return new PacketMotionDataParser().parseMessage(message);
		}

		return undefined;
	}
}

export type Message = PacketMotionData;