import cors from 'cors';
import dgram from 'dgram';
import express from 'express';
import { AddressInfo } from 'net';
import { Server as SocketServer } from 'socket.io';
import { PacketIds } from '../common/constants/packet-ids';
import { SocketEvents } from '../common/constants/socket-events';
import LocalDatabase from './database/local-database';
import MessageHandler from './message-handler';

const SOCKET_PORT = 12040;
const UDP_PORT = 20777;
const HTTP_PORT = 3001;

const udpServer = dgram.createSocket('udp4');
const socketServer = new SocketServer(SOCKET_PORT, {
	cors: {
		origin: "*"
	}
});
const httpServer = express();

httpServer.use(cors());

const database = new LocalDatabase();
const messageHandler = new MessageHandler(database);

udpServer.on('error', (error) => {
	console.log(`Server error:\n${error.message}\n${error.stack}`);
	udpServer.close();
});

udpServer.on('message', (message, remoteInfo) => {
	socketServer.emit(SocketEvents.Data, message);
	messageHandler.handleMessage(message);
});

udpServer.on('listening', () => {
	const address = udpServer.address();
	console.log(`UDP Server listening for F1 data at ${address.address}:${address.port}`)
});

socketServer.on('connection', (socket) => {
	console.log(`Socket ${socket.id} connected`);

	socket.join(PacketIds.Motion.toString());

	socket.on('disconnect', () => {
		console.log(`Socket ${socket.id} disconnected`);
	})
});

httpServer.get('/tracks', (request, response) => {
	response.send(database.getTracks());
});

httpServer.get('/laps', (request, response) => {
	const query = request.query as { trackId?: number, driverName?: string };

	if (query.trackId !== undefined && query.driverName !== undefined) {
		response.send(database.getLapsByTrackAndDriver(query.trackId, query.driverName));
		return;
	}

	if (query.trackId !== undefined) {
		response.send(database.getLapsByTrackId(query.trackId));
		return;
	}

	if (query.driverName !== undefined) {
		response.send(database.getLapsByDriverName(query.driverName));
		return;
	}

	response.status(400).end();
});

httpServer.get('/lapData', (request, response) => {
	const query = request.query as { sessionUID?: string, driverName?: string, lapNumber?: number }
	if (query.sessionUID === undefined || query.driverName === undefined || query.lapNumber === undefined) {
		response.status(400).end();
		return;
	}

	response.send(database.getLapData(query.sessionUID, query.driverName, query.lapNumber));
});

udpServer.bind(UDP_PORT);
const listener = httpServer.listen(HTTP_PORT, () => {
	const address = listener.address() as AddressInfo;
	console.log(`HTTP Server listening on ${address.address}:${address.port}`);
});