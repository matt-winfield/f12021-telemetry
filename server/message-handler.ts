import PacketMessageReader from '../common/parsers/f1-2021/packet-message-reader';
import DataManager from './data-manager';
import LocalDatabase from './database/local-database';

export default class MessageHandler {
	private dataManager: DataManager;

	constructor(database: LocalDatabase) {
		this.dataManager = new DataManager(database);
	}

	public async handleMessage(message: Buffer): Promise<void> {
		return new Promise((resolve, reject) => {
			const parsedMessage = PacketMessageReader.readMessage(message);
			if (parsedMessage) {
				this.dataManager.addMessage(parsedMessage);
			}
			resolve();
		});
	}
}