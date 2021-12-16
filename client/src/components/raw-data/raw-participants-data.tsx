import React from 'react';
import { useParticipantsData } from '../../hooks/live-data/live-data-selectors';
import DataDisplay from '../data-display/data-display';

const RawParticipantsData = () => {
	const data = useParticipantsData();
	return (
		<DataDisplay data={data}></DataDisplay>
	)
}

export default RawParticipantsData
