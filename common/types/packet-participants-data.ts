import { PacketHeader } from "./packet-header";
import { ParticipantData } from "./participant-data";

export type PacketParticipantsData = {
	m_header: PacketHeader;
	m_numActiveCards: number;
	m_participants: ParticipantData[];
}