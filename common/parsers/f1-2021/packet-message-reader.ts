import { PacketIds } from "../../../common/constants/packet-ids";
import { Message } from "../../../common/types/message";
import IPacketDataParser from "./parsers/ipacket-data-parser";
import PacketCarDamageDataParser from "./parsers/packet-car-damage-data-parser";
import PacketCarSetupDataParser from "./parsers//packet-car-setup-data-parser";
import PacketCarStatusDataParser from "./parsers//packet-car-status-data-parser";
import PacketCarTelemetryDataParser from "./parsers//packet-car-telemetry-data-parser";
import PacketEventDataParser from "./parsers//packet-event-data-parser";
import PacketFinalClassificationDataParser from "./parsers//packet-final-classification-data-parser";
import PacketHeaderParser from "./parsers//packet-header-parser";
import PacketLapDataParser from "./parsers//packet-lap-data-parser";
import PacketLobbyInfoDataParser from "./parsers//packet-lobby-info-data-parser";
import PacketMotionDataParser from "./parsers//packet-motion-data-parser";
import PacketParticipantsDataParser from "./parsers//packet-participants-data-parser";
import PacketSessionDataParser from "./parsers//packet-session-data-parser";
import PacketSessionHistoryDataParser from "./parsers//packet-session-history-data-parser";
import { PacketHeader } from "../../types/packet-header";

export default class PacketMessageReader {
	private static readonly parsers: { [key in PacketIds]?: IPacketDataParser } = {
		[PacketIds.Motion]: new PacketMotionDataParser(),
		[PacketIds.Session]: new PacketSessionDataParser(),
		[PacketIds.LapData]: new PacketLapDataParser(),
		[PacketIds.Event]: new PacketEventDataParser(),
		[PacketIds.Participants]: new PacketParticipantsDataParser(),
		[PacketIds.CarSetups]: new PacketCarSetupDataParser(),
		[PacketIds.CarTelemetry]: new PacketCarTelemetryDataParser(),
		[PacketIds.CarStatus]: new PacketCarStatusDataParser(),
		[PacketIds.FinalClassification]: new PacketFinalClassificationDataParser(),
		[PacketIds.LobbyInfo]: new PacketLobbyInfoDataParser(),
		[PacketIds.CarDamage]: new PacketCarDamageDataParser(),
		[PacketIds.SessionHistory]: new PacketSessionHistoryDataParser()
	}

	public static readMessage(message: Buffer, packetFilter?: PacketIds[]): Message | undefined {
		let header = new PacketHeaderParser().parseHeader(message);

		let parser = this.parsers[header.m_packetId as PacketIds];
		if (this.shouldParseMessage(header, parser, packetFilter)) {
			return parser?.parseMessage(message);
		}

		return undefined;
	}

	private static shouldParseMessage(header: PacketHeader, parser?: IPacketDataParser, packetFilter?: PacketIds[]): boolean {
		return parser !== undefined && (!packetFilter || packetFilter.includes(header.m_packetId));
	}
}