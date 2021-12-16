import React from 'react';
import { useMotionData } from '../../hooks/live-data/live-data-selectors';
import DataDisplay from '../data-display/data-display';

const RawMotionData = () => {
	const data = useMotionData();
	return (
		<DataDisplay data={data}></DataDisplay>
	)
}

export default RawMotionData
