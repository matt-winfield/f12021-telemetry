import { Parser } from "binary-parser";
import { PacketLobbyInfoData } from "../../types/packet-lobby-info-data";
import IPacketDataParser from "../ipacket-data-parser";
import PacketHeaderParser from "./packet-header-parser";

export default class PacketLobbyInfoDataParser extends Parser implements IPacketDataParser {
	constructor() {
		super();
		this.endianess('little')
			.nest('m_header', {
				type: new PacketHeaderParser()
			})
			.uint8('m_numPlayers')
			.array('m_lobbyPlayers', {
				length: 22,
				type: new LobbyInfoDataParser()
			})
	}

	parseMessage(message: Buffer): PacketLobbyInfoData {
		return this.parse(message) as PacketLobbyInfoData;
	}
}

class LobbyInfoDataParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint8('m_aiControlled')
			.uint8('m_teamId')
			.uint8('m_nationality')
			.string('m_name', {
				length: 48
			})
			.uint8('m_carNumber')
			.uint8('m_readyStatus');
	}
}