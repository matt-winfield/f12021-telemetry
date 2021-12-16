import React from 'react';
import { useEventData } from '../../hooks/live-data/live-data-selectors';
import DataDisplay from '../data-display/data-display';

const RawEventData = () => {
	const data = useEventData();
	return (
		<DataDisplay data={data}></DataDisplay>
	)
}

export default RawEventData
