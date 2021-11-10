import { Buttons, DriveThroughPenaltyServed, FastestLap, Flashback, Penalty, RaceWinner, Retirement, SpeedTrap, StartLights, StopGoPenaltyServed, TeamMateInPits } from "./event-data-details";
import { PacketHeader } from "./packet-header";

export type PacketEventData = {
	m_header: PacketHeader;
	m_eventStringCode: string;
	m_eventDetails: FastestLap | Retirement | TeamMateInPits | RaceWinner | Penalty
	| SpeedTrap | StartLights | DriveThroughPenaltyServed | StopGoPenaltyServed | Flashback | Buttons;
}