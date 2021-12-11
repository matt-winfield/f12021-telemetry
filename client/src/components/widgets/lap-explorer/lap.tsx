import React, { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import Api from '../../../logic/api';
import LapDataChart from './lap-data-chart';

type ChartValue = {
	lapDistance: number;
	value: number;
}

const Lap = () => {
	const params = useParams();
	const { isLoading, error, data: lapData } = useQuery(
		['track', params.sessionUID, params.driverName, params.lapNumber],
		() => Api.fetchLapData(params.sessionUID ?? '', params.driverName ?? '', Number(params.lapNumber)));

	const getXPositionData = useCallback(() => {
		if (!lapData) return;

		let outputData: ChartValue[] = [];

		Object.keys(lapData).forEach(lapDistance => {
			let dataPoint = lapData[Number(lapDistance)];
			outputData.push({
				lapDistance: Number(lapDistance),
				value: dataPoint.m_worldPositionX
			})
		});
		return outputData;
	}, [lapData])

	const getYPositionData = useCallback(() => {
		if (!lapData) return;

		let outputData: ChartValue[] = [];

		Object.keys(lapData).forEach(lapDistance => {
			let dataPoint = lapData[Number(lapDistance)];
			outputData.push({
				lapDistance: Number(lapDistance),
				value: dataPoint.m_worldPositionY
			})
		});

		return outputData;
	}, [lapData])

	const getZPositionData = useCallback(() => {
		if (!lapData) return;

		let outputData: ChartValue[] = [];

		Object.keys(lapData).forEach(lapDistance => {
			let dataPoint = lapData[Number(lapDistance)];
			outputData.push({
				lapDistance: Number(lapDistance),
				value: dataPoint.m_worldPositionZ
			})
		});

		return outputData;
	}, [lapData])

	return (
		<div>
			{!isLoading && !error &&
				<>
					<LapDataChart data={getXPositionData() ?? []} xAxisLabel='Lap Distance' yAxisLabel='X Position' />
					<LapDataChart data={getYPositionData() ?? []} xAxisLabel='Lap Distance' yAxisLabel='Y Position' />
					<LapDataChart data={getZPositionData() ?? []} xAxisLabel='Lap Distance' yAxisLabel='Z Position' />
				</>
			}
			{isLoading && !error && <ScaleLoader />}
		</div>
	)
}

export default Lap
