import React from 'react'
import { useMotionData } from '../hooks/selectors/live-data-selectors';
import useLiveDataConnection from '../hooks/use-live-data-connection';

const LiveData = () => {
	useLiveDataConnection();
	const motionData = useMotionData();

	return (
		<div>

		</div>
	)
}

export default LiveData;
