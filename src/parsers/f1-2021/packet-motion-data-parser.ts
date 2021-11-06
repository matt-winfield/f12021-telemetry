import { Parser } from "binary-parser";
import HeaderParser, { Header } from "./header-parser";
import MotionDataParser, { MotionData } from "./motion-data-parser";

export default class PacketMotionDataParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.nest('m_header', {
				type: new HeaderParser()
			})
			.array('m_carMotionData', {
				type: new MotionDataParser(),
				length: 22
			})
			.array('m_suspensionPosition', {
				type: 'floatle',
				length: 4
			})
			.array('m_suspensionVelocity', {
				type: 'floatle',
				length: 4
			})
			.array('m_suspensionAcceleration', {
				type: 'floatle',
				length: 4
			})
			.array('m_wheelSpeed', {
				type: 'floatle',
				length: 4
			})
			.array('m_wheelSlip', {
				type: 'floatle',
				length: 4
			})
			.floatle('m_localVelocityX')
			.floatle('m_localVelocityY')
			.floatle('m_localVelocityZ')
			.floatle('m_angularVelocityX')
			.floatle('m_angularVelocityY')
			.floatle('m_angularVelocityZ')
			.floatle('m_angularAccelerationX')
			.floatle('m_angularAccelerationY')
			.floatle('m_angularAccelerationZ')
			.floatle('m_frontWheelsAngle')
	}

	public parseMessage(message: Buffer): PacketMotionData {
		return this.parse(message) as PacketMotionData;
	}
}

export type PacketMotionData = {
	m_header: Header;
	m_carMotionData: MotionData[];
	m_suspensionPosition: number[];
	m_suspensionVelocity: number[];
	m_suspensionAcceleration: number[];
	m_wheelSpeed: number[];
	m_wheelSlip: number[];
	m_localVelocityX: number;
	m_localVelocityY: number;
	m_localVelocityZ: number;
	m_angularVelocityX: number;
	m_angularVelocityY: number;
	m_angularVelocityZ: number;
	m_angularAccelerationX: number;
	m_angularAccelerationY: number;
	m_angularAccelerationZ: number;
	m_frontWheelsAngle: number;
}