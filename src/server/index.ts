import dgram from 'dgram';
import PacketMessageReader from './parsers/f1-2021/packet-message-reader';

const server = dgram.createSocket('udp4');

server.on('error', (error) => {
	console.log(`Server error:\n${error.message}\n${error.stack}`);
	server.close();
});

server.on('message', (message, remoteInfo) => {
	const parsedMessage = PacketMessageReader.readMessage(message);
	if (parsedMessage) {
		console.log(parsedMessage);
	}
});

server.on('listening', () => {
	const address = server.address();
	console.log(`Server listening at ${address.address}:${address.port}`)
});

server.bind(20777);