import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import socketIOClient, { Socket } from 'socket.io-client';
import { PacketIds } from '../../../common/constants/packet-ids';
import { liveDataUpdated } from '../slices/live-data-slice';
import { SocketEvents } from '../../../common/constants/socket-events';

const SOCKET_ENDPOINT = 'http://localhost:12040';
const MIN_TIME_BETWEEN_UPDATES_IN_MS = 10;

const useLiveDataConnection = (packetId: PacketIds) => {
	const dispatch = useDispatch();
	const [socket, setSocket] = useState<Socket>();
	const [lastUpdateTime, setLastUpdateTime] = useState(0);

	useEffect(() => {
		const newSocket = socketIOClient(SOCKET_ENDPOINT);
		setSocket(newSocket);

		newSocket.on('connect', () => {
			console.log(`Socket connected: ${newSocket.id}`);
		});

		newSocket.on('disconnect', () => {
			console.log('Socket disconnected');
		});

		return () => {
			newSocket.close();
		}
	}, []);

	const listener = useCallback((data: string) => {
		let parsedData = JSON.parse(data);
		dispatch(liveDataUpdated(parsedData));
	}, [dispatch]);

	useEffect(() => {
		socket?.on(SocketEvents.Data, listener);

		return () => { socket?.off(SocketEvents.Data, listener); }
	}, [listener, socket, dispatch])

	useEffect(() => {
		socket?.emit(SocketEvents.ChangeChannel, packetId.toString());
	}, [socket, packetId])
}

export default useLiveDataConnection;
