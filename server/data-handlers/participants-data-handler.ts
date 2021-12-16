import { PacketParticipantsData } from '../../common/types/packet-participants-data';
import DataManager from '../data-manager';
import SessionData from '../models/session-data';

export default abstract class ParticipantsDataHandler {
	public static addParticipantsData(message: PacketParticipantsData, sessionData: SessionData) {
		message.m_participants.forEach((participant, carIndex) => {
			DataManager.prepareSessionData(sessionData, carIndex);

			sessionData.cars[carIndex].driverName = participant.m_name.replace(/[^a-zA-Z0-9]+/g, '');
			sessionData.cars[carIndex].aiControlled = !!participant.m_aiControlled;
		})
	}
}