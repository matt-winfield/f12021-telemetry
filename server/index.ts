import dgram from 'dgram';
import { Server as SocketServer } from 'socket.io';
import PacketMessageReader from './parsers/f1-2021/packet-message-reader';
import { SocketEvents } from '../common/constants/socket-events';

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
		console.log(parsedMessage);
		socketServer.send('data', parsedMessage);
	}
});

server.on('listening', () => {
	const address = server.address();
	console.log(`Server listening at ${address.address}:${address.port}`)
});

socketServer.on('connection', (socket) => {
	console.log(`Socket ${socket.id} connected`);
	socket.emit(SocketEvents.Data, 'Hello, world!');

	socket.on('disconnect', () => {
		console.log(`Socket ${socket.id} disconnected`);
	})
})

server.bind(UDP_PORT);