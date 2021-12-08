import { LapData } from "../../common/types/lap-data";
import { PacketLapData } from "../../common/types/packet-lap-data";
import DataManager from "../data-manager";
import SessionData from "../models/session-data";

export type CurrentLapData = {
	[carIndex: number]: CarCurrentLapData;
};

export type CarCurrentLapData = {
	lapNumber: number;
	lapDistance: number;
	lapTimeInMS: number;
	hasCompletedLap: boolean;
};

export default class LapDataHandler {
	private _currentLapData: CurrentLapData = {};

	public currentLapData = (carIndex: number): CarCurrentLapData => {
		this.prepareCurrentLapData(carIndex);
		return this._currentLapData[carIndex];
	}

	public addLapData = (message: PacketLapData, data: SessionData, onLapComplete: (carIndex: number, newCurrentLap: number) => void): void => {
		this.addCarLapData(message, data, onLapComplete);
	}

	private addCarLapData = (message: PacketLapData, data: SessionData, onLapComplete: (carIndex: number, newCurrentLap: number) => void): void => {
		message.m_lapData.forEach((carLapData, carIndex) => {
			const lapDistance = this.currentLapData(carIndex).lapDistance;
			this.prepareCurrentLapData(carIndex);
			const hasCompletedLap = this.hasCompletedLapSinceLastUpdate(carLapData, carIndex, data);
			this.updateCurrentLapData(carLapData, carIndex);
			this.updateSessionData(data, lapDistance, carLapData, carIndex);

			if (hasCompletedLap) {
				onLapComplete(carIndex, carLapData.m_currentLapNum);
			}
		});
	}

	private prepareCurrentLapData = (carIndex: number): void => {
		if (this._currentLapData[carIndex] === undefined) {
			this._currentLapData[carIndex] = {
				lapNumber: 0,
				lapDistance: 0,
				lapTimeInMS: 0,
				hasCompletedLap: false
			}
		}
	}

	private hasCompletedLapSinceLastUpdate = (carLapData: LapData, carIndex: number, sessionData: SessionData): boolean => {
		const currentLapTime = carLapData.m_currentLapTimeInMS;
		const currentLapDistance = carLapData.m_lapDistance;

		const isComplete = currentLapTime < this._currentLapData[carIndex].lapTimeInMS ||
			sessionData.trackLength > 0 && Math.ceil(currentLapDistance) >= Math.floor(sessionData.trackLength);

		const hasCompletedLapSinceLastUpdate = isComplete && !this._currentLapData[carIndex].hasCompletedLap;
		this._currentLapData[carIndex].hasCompletedLap = isComplete;

		return hasCompletedLapSinceLastUpdate;
	}

	private updateSessionData = (sessionData: SessionData, lapDistance: number, carLapData: LapData, carIndex: number): void => {
		const currentLapNumber = this.currentLapData(carIndex).lapNumber;
		DataManager.prepareSessionData(sessionData, carIndex, currentLapNumber)
		const existingData = sessionData.cars[carIndex]?.laps?.[currentLapNumber]?.[lapDistance];
		sessionData.cars[carIndex].laps[currentLapNumber][lapDistance] = {
			...existingData,
			m_currentLapTimeInMS: carLapData.m_currentLapTimeInMS,
			m_carPosition: carLapData.m_carPosition,
			m_driverStatus: carLapData.m_driverStatus
		};
	}

	private updateCurrentLapData = (carLapData: LapData, carIndex: number): void => {
		const currentLapDistance = Math.round(carLapData.m_lapDistance);
		if (currentLapDistance >= 0) {
			this._currentLapData[carIndex].lapDistance = currentLapDistance;
		}
		this._currentLapData[carIndex].lapNumber = carLapData.m_currentLapNum;
		this._currentLapData[carIndex].lapTimeInMS = carLapData.m_currentLapTimeInMS;
	}
}