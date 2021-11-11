import { Parser } from "binary-parser";
import { Message } from "../../types/message";
import { PacketCarSetupData } from "../../types/packet-car-setup-data";
import IPacketDataParser from "../ipacket-data-parser";
import PacketHeaderParser from "./packet-header-parser";

export default class PacketCarSetupDataParser extends Parser implements IPacketDataParser {
	constructor() {
		super();
		this.endianess('little')
			.nest('m_header', {
				type: new PacketHeaderParser()
			})
			.array('m_carSetups', {
				type: new CarSetupDataParser(),
				length: 22
			})
	}

	parseMessage(message: Buffer): Message {
		return this.parse(message) as PacketCarSetupData;
	}
}

class CarSetupDataParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint8('m_frontWing')
			.uint8('m_rearWing')
			.uint8('m_onThrottle')
			.uint8('m_offThrottle')
			.floatle('m_frontCamber')
			.floatle('m_rearCamber')
			.floatle('m_frontToe')
			.floatle('m_rearToe')
			.uint8('m_frontSuspension')
			.uint8('m_rearSuspension')
			.uint8('m_frontAntiRollBar')
			.uint8('m_rearAntiRollBar')
			.uint8('m_frontSuspensionHeight')
			.uint8('m_rearSuspensionHeight')
			.uint8('m_brakePressure')
			.uint8('m_brakeBias')
			.floatle('m_rearLeftTyrePressure')
			.floatle('m_rearRightTyrePressure')
			.floatle('m_frontLeftTyrePressure')
			.floatle('m_frontRightTyrePressure')
			.uint8('m_ballast')
			.floatle('fuelLoad');
	}
}