import { PacketIds } from '../common/constants/packet-ids';
import { Message } from '../common/types/message';
import { PacketCarTelemetryData } from '../common/types/packet-car-telemetry-data';
import { PacketLapData } from '../common/types/packet-lap-data';
import { PacketMotionData } from '../common/types/packet-motion-data';
import { PacketParticipantsData } from '../common/types/packet-participants-data';
import { PacketSessionData } from '../common/types/packet-session-data';
import LapDataHandler from './data-handlers/lap-data-handler';
import MotionDataHandler from './data-handlers/motion-data-handler';
import ParticipantsDataHandler from './data-handlers/participants-data-handler';
import SessionDataHandler from './data-handlers/session-data-handler';
import TelemetryDataHandler from './data-handlers/telemetry-data-handler';
import LocalDatabase from './database/local-database';
import SessionData from './models/session-data';

export default class DataManager {
	private data: SessionData = new SessionData();
	private database: LocalDatabase;
	private lapDataHandler: LapDataHandler = new LapDataHandler();

	constructor(database: LocalDatabase) {
		this.database = database;
	}

	public addMessage(message: Message): void {
		this.data.sessionUID = message.m_header.m_sessionUID;

		if (this.isMotionData(message)) {
			MotionDataHandler.addMotionData(message, this.data, this.lapDataHandler.currentLapData);
		}

		if (this.isLapData(message)) {
			this.lapDataHandler.addLapData(message, this.data, this.onLapComplete);
		}

		if (this.isSessionData(message)) {
			SessionDataHandler.addSessionData(message, this.data);
		}

		if (this.isCarTelemetryData(message)) {
			TelemetryDataHandler.addCarTelemetryData(message, this.data, this.lapDataHandler.currentLapData);
		}

		if (this.isParticipants(message)) {
			ParticipantsDataHandler.addParticipantsData(message, this.data);
		}
	}

	public static prepareSessionData(data: SessionData, carIndex: number, lapNumber?: number): void {
		if (data.cars[carIndex] === undefined) {
			data.cars[carIndex] = {
				driverName: '',
				aiControlled: false,
				laps: {}
			}
		}

		if (lapNumber !== undefined && data.cars[carIndex].laps[lapNumber] === undefined) {
			data.cars[carIndex].laps[lapNumber] = {};
		}
	}

	private onLapComplete = (carIndex: number, completedLapNumber: number): void => {
		const savePromise = new Promise((resolve, reject) => {
			this.database.saveData(this.data, carIndex, completedLapNumber);
			resolve(null);
		});

		savePromise.then(() => {
			delete this.data.cars[carIndex].laps[completedLapNumber];
		});
	}

	private isMotionData(message: Message): message is PacketMotionData {
		return message.m_header.m_packetId === PacketIds.Motion;
	}

	private isLapData(message: Message): message is PacketLapData {
		return message.m_header.m_packetId === PacketIds.LapData;
	}

	private isSessionData(message: Message): message is PacketSessionData {
		return message.m_header.m_packetId === PacketIds.Session;
	}

	private isCarTelemetryData(message: Message): message is PacketCarTelemetryData {
		return message.m_header.m_packetId === PacketIds.CarTelemetry
	}

	private isParticipants(message: Message): message is PacketParticipantsData {
		return message.m_header.m_packetId === PacketIds.Participants
	}
}