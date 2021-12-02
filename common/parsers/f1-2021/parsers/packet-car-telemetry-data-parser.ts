import { Parser } from "binary-parser";
import { Message } from "../../../types/message";
import { PacketCarTelemetryData } from "../../../types/packet-car-telemetry-data";
import IPacketDataParser from "./ipacket-data-parser";
import PacketHeaderParser from "./packet-header-parser";

export default class PacketCarTelemetryDataParser extends Parser implements IPacketDataParser {
	constructor() {
		super();
		this.endianess('little')
			.nest('m_header', {
				type: new PacketHeaderParser()
			})
			.array('m_carTelemetryData', {
				type: new CarTelemetryDataParser(),
				length: 22
			})
			.uint8('m_mfdPanelIndex')
			.uint8('m_mfdPanelIndexSecondaryPlayer')
			.int8('m_suggestedGear')
	}

	parseMessage(message: Buffer): Message {
		return this.parse(message) as PacketCarTelemetryData;
	}
}

class CarTelemetryDataParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint16('m_speed')
			.floatle('m_throttle')
			.floatle('m_steer')
			.floatle('m_brake')
			.uint8('m_clutch')
			.int8('m_gear')
			.uint16('m_engineRPM')
			.uint8('m_drs')
			.uint8('m_revLightsPercent')
			.uint16('m_revLightsBitValue')
			.array('m_brakesTemperature', {
				type: 'uint16le',
				length: 4
			})
			.array('m_tyresSurfaceTemperature', {
				type: 'uint8',
				length: 4
			})
			.array('m_tyresInnerTemperature', {
				type: 'uint8',
				length: 4
			})
			.uint16('m_engineTemperature')
			.array('m_tyresPressure', {
				type: 'floatle',
				length: 4
			})
			.array('m_surfaceType', {
				type: 'uint8',
				length: 4
			})
	}
}