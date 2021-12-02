import React from 'react'
import { useLobbyInfo } from '../../../hooks/live-data/live-data-selectors'
import DataDisplay from '../../data-display'

const RawLobbyInfo = () => {
	const data = useLobbyInfo();
	return (
		<DataDisplay data={data}></DataDisplay>
	)
}

export default RawLobbyInfo
