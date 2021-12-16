import React from 'react';
import { useCarTelemetry } from '../../hooks/live-data/live-data-selectors';
import DataDisplay from '../data-display/data-display';

const RawCarTelemetry = () => {
	const data = useCarTelemetry();
	return (
		<DataDisplay data={data}></DataDisplay>
	)
}

export default RawCarTelemetry
