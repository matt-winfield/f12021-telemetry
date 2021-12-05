import { PacketIds } from '../common/constants/packet-ids';
import { Message } from '../common/types/message';
import { PacketMotionData } from '../common/types/packet-motion-data';
import MotionDataHandler from './data-handlers/motion-data-handler';
import CarData from './models/car-data';
import SessionData from './models/session-data';

export default class DataManager {
	private data: SessionData = new SessionData();

	public addMessage(message: Message): void {
		if (this.isMotionData(message)) {
			MotionDataHandler.addMotionData(message, this.data);
		}
	}

	public static prepareData(data: SessionData, frameId: number, carIndex: number): void {
		if (data.carData[carIndex] === undefined) {
			data.carData[carIndex] = new CarData();
		}

		if (data.carData[carIndex].data[frameId] == undefined) {
			data.carData[carIndex].data[frameId] = {};
		}
	}

	private isMotionData(message: Message): message is PacketMotionData {
		return message.m_header.m_packetId === PacketIds.Motion;
	}
}