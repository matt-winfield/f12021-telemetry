import { Parser } from "binary-parser";
import { Message } from "../../../types/message";
import { PacketParticipantsData } from "../../../types/packet-participants-data";
import IPacketDataParser from "./ipacket-data-parser";
import PacketHeaderParser from "./packet-header-parser";

export default class PacketParticipantsDataParser extends Parser implements IPacketDataParser {
	constructor() {
		super();
		this.endianess('little')
			.nest('m_header', {
				type: new PacketHeaderParser()
			})
			.uint8('m_numActiveCars')
			.array('m_participants', {
				type: new ParticipantDataParser(),
				length: 22
			});
	}

	parseMessage(message: Buffer): Message {
		return this.parse(message) as PacketParticipantsData;
	}
}

class ParticipantDataParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint8('m_aiControlled')
			.uint8('m_driverId')
			.uint8('m_networkId')
			.uint8('m_teamId')
			.uint8('m_myTeam')
			.uint8('m_raceNumber')
			.uint8('m_nationality')
			.string('m_name', { length: 48 })
			.uint8('m_yourTelemetry');
	}
}