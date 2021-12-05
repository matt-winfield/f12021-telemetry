import dgram from 'dgram';
import { Server as SocketServer } from 'socket.io';
import { PacketIds } from '../common/constants/packet-ids';
import { SocketEvents } from '../common/constants/socket-events';
import MessageHandler from './message-handler';

const SOCKET_PORT = 12040;
const UDP_PORT = 20777;

const server = dgram.createSocket('udp4');
const socketServer = new SocketServer(SOCKET_PORT, {
	cors: {
		origin: "*"
	}
});

const messageHandler = new MessageHandler();

server.on('error', (error) => {
	console.log(`Server error:\n${error.message}\n${error.stack}`);
	server.close();
});

server.on('message', (message, remoteInfo) => {
	socketServer.emit(SocketEvents.Data, message);
	messageHandler.handleMessage(message);
});

server.on('listening', () => {
	const address = server.address();
	console.log(`UDP Server listening for F1 data at ${address.address}:${address.port}`)
});

socketServer.on('connection', (socket) => {
	console.log(`Socket ${socket.id} connected`);

	socket.join(PacketIds.Motion.toString());

	socket.on('disconnect', () => {
		console.log(`Socket ${socket.id} disconnected`);
	})
})

server.bind(UDP_PORT);