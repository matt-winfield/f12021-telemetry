export type FastestLap = {
	vehicleIdx: number;
	lapTime: number;
}

export type Retirement = {
	vehicleIdx: number;
}

export type TeamMateInPits = {
	vehicleIdx: number;
}

export type RaceWinner = {
	vehicleIdx: number;
}

export type Penalty = {
	penaltyType: number;
	infringementType: number;
	vehicleIdx: number;
	otherVehicleIdx: number;
	time: number;
	lapNum: number;
	placesGained: number;
}

export type SpeedTrap = {
	vehicleIdx: number;
	speed: number;
	overallFastestInSession: number;
	driverFastestInSession: number;
}

export type StartLights = {
	numLights: number;
}

export type DriveThroughPenaltyServed = {
	vehicleIdx: number;
}

export type StopGoPenaltyServed = {
	vehicleIdx: number;
}

export type Flashback = {
	flashbackFrameIdentifier: number;
	flashbackSessionTime: number;
}

export type Buttons = {
	m_buttonStatus: number;
}