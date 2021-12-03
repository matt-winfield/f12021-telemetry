import React from 'react'
import { useSessionData } from '../../../hooks/live-data/live-data-selectors'
import DataDisplay from '../../data-display/data-display'

const RawSessionData = () => {
	const data = useSessionData();
	return (
		<DataDisplay data={data}></DataDisplay>
	)
}

export default RawSessionData
