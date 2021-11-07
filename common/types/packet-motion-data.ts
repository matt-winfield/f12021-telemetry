import { PacketHeader } from "./packet-header";
import { MotionData } from "./motion-data";

export type PacketMotionData = {
	m_header: PacketHeader;
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