import { Parser } from "binary-parser";
import { PacketCarDamageData } from "../../types/packet-car-damage-data";
import IPacketDataParser from "../ipacket-data-parser";
import PacketHeaderParser from "./packet-header-parser";

export default class PacketCarDamageDataParser extends Parser implements IPacketDataParser {
	constructor() {
		super();
		this.endianess('little')
			.nest('m_header', {
				type: new PacketHeaderParser()
			})
			.array('m_carDamageData', {
				type: new CarDamageDataParser(),
				length: 22
			});
	}
	parseMessage(message: Buffer): PacketCarDamageData {
		return this.parse(message) as PacketCarDamageData;
	}
}

class CarDamageDataParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.array('m_tyresWear', {
				type: 'floatle',
				length: 4
			})
			.array('m_tyresDamage', {
				type: 'uint8',
				length: 4
			})
			.array('m_brakesDamage', {
				type: 'uint8',
				length: 4
			})
			.uint8('m_frontLeftWingDamage')
			.uint8('m_frontRightWingDamage')
			.uint8('m_rearWingDamage')
			.uint8('m_floorDamage')
			.uint8('m_diffuserDamage')
			.uint8('m_sidepodDamage')
			.uint8('m_drsFault')
			.uint8('m_gearboxDamage')
			.uint8('m_engineDamage')
			.uint8('m_engineMGUHWear')
			.uint8('m_engineESWear')
			.uint8('m_engineCEWear')
			.uint8('m_engineICEWear')
			.uint8('m_engineMGUKWear')
			.uint8('m_engineTCWear');
	}
}