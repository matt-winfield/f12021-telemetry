import dgram from 'dgram';
import { Server as SocketServer } from 'socket.io';
import PacketMessageReader from './parsers/f1-2021/packet-message-reader';
import { SocketEvents } from '../common/constants/socket-events';
import SocketDataFormatter from './socket-data-formatter';

const SOCKET_PORT = 12040;
const UDP_PORT = 20777;

const server = dgram.createSocket('udp4');
const socketServer = new SocketServer(SOCKET_PORT, {
	cors: {
		origin: "*"
	}
});

server.on('error', (error) => {
	console.log(`Server error:\n${error.message}\n${error.stack}`);
	server.close();
});

server.on('message', (message, remoteInfo) => {
	const parsedMessage = PacketMessageReader.readMessage(message);
	if (parsedMessage) {
		const formattedMessage = SocketDataFormatter.formatData(parsedMessage)
		socketServer.emit(SocketEvents.Data, formattedMessage);
	}
});

server.on('listening', () => {
	const address = server.address();
	console.log(`UDP Server listening for F1 data at ${address.address}:${address.port}`)
});

socketServer.on('connection', (socket) => {
	console.log(`Socket ${socket.id} connected`);

	socket.on('disconnect', () => {
		console.log(`Socket ${socket.id} disconnected`);
	})
})

server.bind(UDP_PORT);