import { Parser } from "binary-parser";
import { Message } from "../../../types/message";
import { PacketCarStatusData } from "../../../types/packet-car-status-data";
import IPacketDataParser from "./ipacket-data-parser";
import PacketHeaderParser from "./packet-header-parser";

export default class PacketCarStatusDataParser extends Parser implements IPacketDataParser {
	constructor() {
		super();
		this.nest('m_header', {
			type: new PacketHeaderParser()
		})
			.array('m_carStatusData', {
				type: new CarStatusDataParser(),
				length: 22
			});
	}

	parseMessage(message: Buffer): Message {
		return this.parse(message) as PacketCarStatusData;
	}
}

class CarStatusDataParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint8('m_tractionControl')
			.uint8('m_antiLockBrakes')
			.uint8('m_fuelMix')
			.uint8('m_frontBrakeBias')
			.uint8('m_pitLimiterStatus')
			.floatle('m_fuelInTank')
			.floatle('m_fuelCapacity')
			.floatle('m_fuelRemainingInLaps')
			.uint16('m_maxRPM')
			.uint16('m_idleRPM')
			.uint8('m_maxGears')
			.uint8('m_drsAllowed')
			.uint16('m_drsActivationDistance')
			.uint8('m_actualTyreCompound')
			.uint8('m_visualTyreCompound')
			.uint8('m_tyreAgeLaps')
			.int8('m_vehicleFiaFlags')
			.floatle('m_ersStoreEnergy')
			.uint8('m_ersDeployMode')
			.floatle('m_ersHarvestedThisLapMGUK')
			.floatle('m_ersHarvestedThisLapMGUH')
			.floatle('m_ersDeployedThisLap')
			.uint8('m_networkPaused');
	}
}