import { useCallback, useEffect, useRef, useState } from 'react'
import { batch, useDispatch } from 'react-redux';
import socketIOClient, { Socket } from 'socket.io-client';
import { liveDataUpdated } from '../slices/live-data-slice';
import { SocketEvents } from '../../../common/constants/socket-events';
import PacketMessageReader from '../../../common/parsers/f1-2021/packet-message-reader';
import { Action } from '@reduxjs/toolkit';

const SOCKET_ENDPOINT = 'http://localhost:12040';

const useLiveDataConnection = (updateIntervalMs: number = 50) => {
	const dispatch = useDispatch();
	const [socket, setSocket] = useState<Socket>();
	const actionQueue = useRef<Action[]>([]);

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

	useEffect(() => {
		const interval = setInterval(() => {
			batch(() => {
				for (let action of actionQueue.current) {
					dispatch(action);
				}
			});
			actionQueue.current = [];
		}, updateIntervalMs);

		return () => {
			clearInterval(interval);
		}
	}, [dispatch, updateIntervalMs])

	const listener = useCallback((data: ArrayBuffer) => {
		const buffer = Buffer.from(data);
		const parsedData = PacketMessageReader.readMessage(buffer);
		if (parsedData) {
			actionQueue.current.push(liveDataUpdated(parsedData));
		}
	}, []);

	useEffect(() => {
		socket?.on(SocketEvents.Data, listener);

		return () => { socket?.off(SocketEvents.Data, listener); }
	}, [listener, socket, dispatch])
}

export default useLiveDataConnection;
