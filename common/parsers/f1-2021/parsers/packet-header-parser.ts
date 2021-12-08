import { Parser } from 'binary-parser';
import { PacketHeader } from '../../../../common/types/packet-header';

export default class PacketHeaderParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint16('m_packetFormat')
			.uint8('m_gameMajorVersion')
			.uint8('m_gameMinorVersion')
			.uint8('m_packetVersion')
			.uint8('m_packetId')
			.uint64('m_sessionUID', {
				formatter: (value: number) => value.toString(16)
			})
			.floatle('m_sessionTime')
			.uint32('m_frameIdentifier')
			.uint8('m_playerCarIndex')
			.uint8('m_secondaryPlayerCarIndex');
	}

	public parseHeader(message: Buffer): PacketHeader {
		return this.parse(message) as PacketHeader;
	}
}