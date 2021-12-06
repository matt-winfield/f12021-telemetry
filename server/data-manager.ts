import { PacketIds } from '../common/constants/packet-ids';
import { Message } from '../common/types/message';
import { PacketLapData } from '../common/types/packet-lap-data';
import { PacketMotionData } from '../common/types/packet-motion-data';
import LapDataHandler from './data-handlers/lap-data-handler';
import MotionDataHandler from './data-handlers/motion-data-handler';
import LocalDatabase from './local-database';
import CarData from './models/car-data';
import LiveInfo from './models/live-info';
import SessionData from './models/session-data';

export default class DataManager {
	private data: SessionData = new SessionData();
	private liveInfo: LiveInfo = new LiveInfo();
	private database: LocalDatabase = new LocalDatabase();

	public addMessage(message: Message): void {
		if (this.isMotionData(message)) {
			MotionDataHandler.addMotionData(message, this.data);
		}

		if (this.isLapData(message)) {
			LapDataHandler.addLapData(message, this.data, this.liveInfo, this.onLapComplete);
		}
	}

	public static prepareData(data: SessionData, sessionTime: number, carIndex: number): void {
		if (data.carData[carIndex] === undefined) {
			data.carData[carIndex] = new CarData();
		}

		if (data.carData[carIndex].data[sessionTime] == undefined) {
			data.carData[carIndex].data[sessionTime] = {};
		}
	}

	private onLapComplete = (carIndex: number, newCurrentLap: number): void => {
		console.log(`${carIndex} is now on lap ${newCurrentLap}`)
		this.database.saveData(this.data);
	}

	private isMotionData(message: Message): message is PacketMotionData {
		return message.m_header.m_packetId === PacketIds.Motion;
	}

	private isLapData(message: Message): message is PacketLapData {
		return message.m_header.m_packetId === PacketIds.LapData;
	}
}