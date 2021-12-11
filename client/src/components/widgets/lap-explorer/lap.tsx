import React, { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import { SavedDataProperties } from '../../../../../common/model/saved-data-properties';
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
		() => Api.fetchLapData(params.sessionUID ?? '', params.driverName ?? '', Number(params.lapNumber)),
		{
			refetchInterval: false,
			refetchOnWindowFocus: false,
			refetchIntervalInBackground: false
		});

	const getData = useCallback((selector: (value: SavedDataProperties) => number) => {
		if (!lapData) return;

		let outputData: ChartValue[] = [];

		Object.keys(lapData).forEach(lapDistance => {
			let dataPoint = lapData[Number(lapDistance)];
			outputData.push({
				lapDistance: Number(lapDistance),
				value: selector(dataPoint)
			})
		});
		return outputData;
	}, [lapData])

	return (
		<div>
			{!isLoading && !error &&
				<>
					<LapDataChart data={getData(x => x.currentLapTimeInMS / 1000) ?? []} xAxisLabel='Lap Distance' yAxisLabel='Lap Time (s)' xAxisUnit='m' yAxisUnit='s' />
					<LapDataChart data={getData(x => x.speed) ?? []} xAxisLabel='Lap Distance' yAxisLabel='Speed (km/h)' xAxisUnit='m' yAxisUnit='km/h' />
					<LapDataChart data={getData(x => x.throttle * 100) ?? []} xAxisLabel='Lap Distance' yAxisLabel='Throttle %' xAxisUnit='m' yAxisUnit='%' />
					<LapDataChart data={getData(x => x.brake * 100) ?? []} xAxisLabel='Lap Distance' yAxisLabel='Brake %' xAxisUnit='m' yAxisUnit='%' />
					<LapDataChart data={getData(x => x.steering) ?? []} xAxisLabel='Lap Distance' yAxisLabel='Steering' xAxisUnit='m' />
					<LapDataChart data={getData(x => x.engineRPM) ?? []} xAxisLabel='Lap Distance' yAxisLabel='Engine RPM' xAxisUnit='m' yAxisUnit='RPM' />
					<LapDataChart data={getData(x => x.drs) ?? []} xAxisLabel='Lap Distance' yAxisLabel='DRS Activation' xAxisUnit='m' />
				</>
			}
			{isLoading && !error && <ScaleLoader />}
		</div>
	)
}

export default Lap;
