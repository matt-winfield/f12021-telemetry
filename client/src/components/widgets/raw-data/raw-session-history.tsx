import React from 'react'
import { useSessionHistory } from '../../../hooks/live-data/live-data-selectors'
import DataDisplay from '../../data-display'

const RawSessionHistory = () => {
	const data = useSessionHistory();
	return (
		<DataDisplay data={data}></DataDisplay>
	)
}

export default RawSessionHistory
