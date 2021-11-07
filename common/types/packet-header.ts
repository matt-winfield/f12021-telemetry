export type PacketHeader = {
	m_packetFormat: number;
	m_gameMajorVersion: number;
	m_gameMinorVerion: number;
	m_packetVersion: number;
	m_packetId: number;
	m_sessionUID: number;
	m_sessionTime: number;
	m_frameIdentifier: number;
	m_playerCarIndex: number;
	m_secondaryPlayerCarIndex: number;
}