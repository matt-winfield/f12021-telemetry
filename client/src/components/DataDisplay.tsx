import React, { useEffect } from 'react'
import styled from 'styled-components'
import socketIOClient from 'socket.io-client';

const SOCKET_ENDPOINT = "http://localhost:12040";

const Header = styled.div`
	padding: 10px;
	background-color: grey;
`

const DataDisplay = () => {
	useEffect(() => {
		const socket = socketIOClient(SOCKET_ENDPOINT)
		socket.on('connect', () => {
			console.log(`Socket connected: ${socket.id}`);
		});
		socket.on('disconnect', () => {
			console.log('Socket disconnected');
		});
		socket.on('data', (data) => {
			console.log(data);
		});
	}, [])

	return (
		<Header>
			Test
		</Header>
	)
}

export default DataDisplay
