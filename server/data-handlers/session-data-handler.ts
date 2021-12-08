import { PacketSessionData } from "../../common/types/packet-session-data";
import SessionData from "../models/session-data";

export default abstract class SessionDataHandler {
	public static addSessionData(message: PacketSessionData, data: SessionData): void {
		data.trackLength = message.m_trackLength;
		data.trackId = message.m_trackId;
	}
}