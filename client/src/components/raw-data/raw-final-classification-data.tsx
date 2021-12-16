import React from 'react';
import { useFinalClassificationData } from '../../hooks/live-data/live-data-selectors';
import DataDisplay from '../data-display/data-display';

const RawFinalClassificationData = () => {
	const data = useFinalClassificationData();
	return (
		<DataDisplay data={data}></DataDisplay>
	)
}

export default RawFinalClassificationData
