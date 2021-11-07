import React from 'react'
import { useMotionData } from '../hooks/selectors/live-data-selectors';
import useLiveDataConnection from '../hooks/use-live-data-connection';
import DataDisplay from './data-display';

const LiveData = () => {
	useLiveDataConnection();
	const motionData = useMotionData();

	return (
		<div>
			<DataDisplay data={motionData}></DataDisplay>
		</div>
	)
}

export default LiveData;
