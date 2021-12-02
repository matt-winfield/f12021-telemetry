import React from 'react'
import { useCarDamageData } from '../../../hooks/live-data/live-data-selectors'
import DataDisplay from '../../data-display'

const RawCarDamageData = () => {
	const data = useCarDamageData();
	return (
		<DataDisplay data={data}></DataDisplay>
	)
}

export default RawCarDamageData
