import React from 'react'
import { useCarStatus } from '../../../hooks/live-data/live-data-selectors'
import DataDisplay from '../../data-display/data-display'

const RawCarStatus = () => {
	const data = useCarStatus();
	return (
		<DataDisplay data={data}></DataDisplay>
	)
}

export default RawCarStatus
