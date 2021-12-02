import { Message } from "../../../types/message";

export default interface IPacketDataParser {
	parseMessage(message: Buffer): Message
}