import { PacketIds } from '../common/constants/packet-ids';
import { Message } from '../common/types/message';
import { PacketLapData } from '../common/types/packet-lap-data';
import { PacketMotionData } from '../common/types/packet-motion-data';
import LapDataHandler from './data-handlers/lap-data-handler';
import MotionDataHandler from './data-handlers/motion-data-handler';
import LocalDatabase from './local-database';
import SessionData from './models/session-data';

export default class DataManager {
	private data: SessionData = new SessionData();
	private database: LocalDatabase = new LocalDatabase();
	private lapDataHandler: LapDataHandler = new LapDataHandler();

	public addMessage(message: Message): void {
		if (this.isMotionData(message)) {
			MotionDataHandler.addMotionData(message, this.data, this.lapDataHandler.currentLapData);
		}

		if (this.isLapData(message)) {
			this.lapDataHandler.addLapData(message, this.data, this.onLapComplete);
		}
	}

	public static prepareSessionData(data: SessionData, carIndex: number, lapNumber?: number): void {
		if (data.cars[carIndex] === undefined) {
			data.cars[carIndex] = {
				driverName: '',
				laps: {}
			}
		}

		if (lapNumber !== undefined && data.cars[carIndex].laps[lapNumber] === undefined) {
			data.cars[carIndex].laps[lapNumber] = {};
		}
	}

	private onLapComplete = (carIndex: number, newCurrentLap: number): void => {
		console.log(`${carIndex} is now on lap ${newCurrentLap}`)
		const savePromise = new Promise((resolve, reject) => {
			this.database.saveData(this.data);
			resolve(null);
		});

		savePromise.then(() => {
			this.data.cars = {};
		});
	}

	private isMotionData(message: Message): message is PacketMotionData {
		return message.m_header.m_packetId === PacketIds.Motion;
	}

	private isLapData(message: Message): message is PacketLapData {
		return message.m_header.m_packetId === PacketIds.LapData;
	}
}