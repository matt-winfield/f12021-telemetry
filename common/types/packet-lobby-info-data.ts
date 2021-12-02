import { LobbyInfoData } from "./lobby-info-data";
import { PacketHeader } from "./packet-header";

export type PacketLobbyInfoData = {
	m_header: PacketHeader;
	m_numPlayers: number;
	m_lobbyPlayers: LobbyInfoData[];
}