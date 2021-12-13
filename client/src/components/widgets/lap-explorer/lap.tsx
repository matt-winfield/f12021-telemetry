import React, { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import { SavedDataProperties } from '../../../../../common/model/saved-data-properties';
import Api from '../../../logic/api';
import { resetZoom } from '../../../slices/chart-slice';
import { Button } from '../../button';
import LapDataChart from './lap-data-chart';

const tyreKeys = ['Front Left', 'Front Right', 'Rear Left', 'Rear Right'];

const Lap = () => {
	const dispatch = useDispatch();
	const params = useParams();
	const { isLoading, error, data: lapData } = useQuery(
		['track', params.sessionUID, params.driverName, params.lapNumber],
		() => Api.fetchLapData(params.sessionUID ?? '', params.driverName ?? '', Number(params.lapNumber)),
		{
			refetchInterval: false,
			refetchOnWindowFocus: false,
			refetchIntervalInBackground: false
		});

	const onResetZoomClicked = useCallback(() => {
		dispatch(resetZoom());
	}, [dispatch]);

	const getData = useCallback((selector: (value: SavedDataProperties) => number | number[], dataKeys?: string[]): { data: any[] } => {
		if (!lapData) return { data: [] };

		let outputData: any[] = [];

		Object.keys(lapData).forEach(lapDistance => {
			const dataPoint = lapData[Number(lapDistance)];
			const value = selector(dataPoint);

			const mappedDataKeys: { [key: string]: number } = {};
			if (Array.isArray(value) && value.length === dataKeys?.length) {
				dataKeys?.forEach((key, index) => {
					mappedDataKeys[key] = value[index];
				});
			} else {
				mappedDataKeys['value'] = value as number;
			}

			outputData.push({
				lapDistance: Number(lapDistance),
				...mappedDataKeys
			})
		});
		return {
			data: outputData
		}
	}, [lapData]);

	const lapTimeData = useMemo(() => getData(x => x.currentLapTimeInMS / 1000), [getData]);
	const speedData = useMemo(() => getData(x => x.speed), [getData]);
	const throttleData = useMemo(() => getData(x => x.throttle), [getData]);
	const brakeData = useMemo(() => getData(x => x.brake), [getData]);
	const steeringData = useMemo(() => getData(x => x.steering), [getData]);
	const gearData = useMemo(() => getData(x => x.gear), [getData]);
	const engineRPMData = useMemo(() => getData(x => x.engineRPM), [getData]);
	const drsData = useMemo(() => getData(x => x.drs), [getData]);
	const slipData = useMemo(() => getData(x => x.wheelSlip, tyreKeys), [getData]);

	return (
		<div>
			{!isLoading && !error &&
				<>
					<Button onClick={onResetZoomClicked}>Reset Zoom</Button>
					<LapDataChart data={lapTimeData.data} xAxisLabel='Lap Distance' yAxisLabel='Lap Time (s)' xAxisUnit='m' yAxisUnit='s' />
					<LapDataChart data={speedData.data} xAxisLabel='Lap Distance' yAxisLabel='Speed (km/h)' xAxisUnit='m' yAxisUnit='km/h' />
					<LapDataChart data={throttleData.data} xAxisLabel='Lap Distance' yAxisLabel='Throttle %' xAxisUnit='m' yAxisUnit='%' />
					<LapDataChart data={brakeData.data} xAxisLabel='Lap Distance' yAxisLabel='Brake %' xAxisUnit='m' yAxisUnit='%' />
					<LapDataChart data={steeringData.data} xAxisLabel='Lap Distance' yAxisLabel='Steering' xAxisUnit='m' />
					<LapDataChart data={gearData.data} xAxisLabel='Lap Distance' yAxisLabel='Gear' xAxisUnit='m' />
					<LapDataChart data={engineRPMData.data} xAxisLabel='Lap Distance' yAxisLabel='Engine RPM' xAxisUnit='m' yAxisUnit='RPM' />
					<LapDataChart data={drsData.data} xAxisLabel='Lap Distance' yAxisLabel='DRS Activation' xAxisUnit='m' />
					<LapDataChart data={slipData.data} dataKeys={tyreKeys} xAxisLabel='Lap Distance' yAxisLabel='Wheel Slip' xAxisUnit='m' />
				</>
			}
			{isLoading && !error && <ScaleLoader />}
		</div>
	)
}

export default Lap;
