import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import socketIOClient from 'socket.io-client';
import { Message } from '../../../common/types/message';
import { liveDataUpdated } from '../slices/live-data-slice';

const SOCKET_ENDPOINT = "http://localhost:12040";

const useLiveDataConnection = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const socket = socketIOClient(SOCKET_ENDPOINT)
		socket.on('connect', () => {
			console.log(`Socket connected: ${socket.id}`);
		});
		socket.on('disconnect', () => {
			console.log('Socket disconnected');
		});
		socket.on('data', (data: Message) => {
			console.log(data);
			dispatch(liveDataUpdated(data));
		});

		return () => {
			socket.close();
		}
	}, [dispatch]);
}

export default useLiveDataConnection;
