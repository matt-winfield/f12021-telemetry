import { Parser } from 'binary-parser';

export default class HeaderParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint16('m_packetFormat')
			.uint8('m_gameMajorVersion')
			.uint8('m_gameMinorVersion')
			.uint8('m_packetVersion')
			.uint8('m_packetId')
			.uint64('m_sessionUID')
			.floatle('m_sessionTime')
			.uint32('m_frameIdentifier')
			.uint8('m_playerCarIndex')
			.uint8('m_secondaryPlayerCarIndex');
	}

	public parseHeader(message: Buffer): Header {
		return this.parse(message) as Header;
	}
}

export type Header = {
	m_packetFormat: number;
	m_gameMajorVersion: number;
	m_gameMinorVerion: number;
	m_packetVersion: number;
	m_packetId: number;
	m_sessionUID: number;
	m_sessionTime: number;
	m_frameIdentifier: number;
	m_playerCarIndex: number;
	m_secondaryPlayerCarIndex: number;
}