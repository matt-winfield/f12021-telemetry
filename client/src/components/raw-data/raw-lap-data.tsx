import React from 'react';
import { useLapData } from '../../hooks/live-data/live-data-selectors';
import DataDisplay from '../data-display/data-display';

const RawLapData = () => {
	const data = useLapData();
	return (
		<DataDisplay data={data}></DataDisplay>
	)
}

export default RawLapData
