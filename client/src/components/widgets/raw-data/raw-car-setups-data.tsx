import React from 'react'
import { useCarSetups } from '../../../hooks/live-data/live-data-selectors'
import DataDisplay from '../../data-display'

const RawCarSetupsData = () => {
	const data = useCarSetups();
	return (
		<DataDisplay data={data}></DataDisplay>
	)
}

export default RawCarSetupsData
