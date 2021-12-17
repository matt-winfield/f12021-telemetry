import { SavedDataProperties } from "./saved-data-properties"

export type LapInfo = {
	sessionUID: string,
	trackId: number,
	driverName: string,
	lapNumber: number
}

export type LapData = {
	lapInfo: LapInfo,
	data: { [lapDistance: number]: SavedDataProperties };
}
