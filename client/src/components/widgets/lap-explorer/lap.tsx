import React, { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import { TyreIds } from '../../../../../common/constants/tyre-ids';
import { SavedDataProperties } from '../../../../../common/model/saved-data-properties';
import Api from '../../../logic/api';
import { resetZoom } from '../../../slices/chart-slice';
import { Button } from '../../button';
import LapDataChart, { ChartDataPoint } from './lap-data-chart';

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

	const getData = useCallback((selectors: ((dataPoint: SavedDataProperties) => number)[]): ChartDataPoint[][] => {
		if (!lapData) return [];

		let outputData: ChartDataPoint[][] = [];

		for (const selector of selectors) {
			const values: ChartDataPoint[] = [];
			Object.keys(lapData).forEach(key => {
				const lapDistance = Number(key);
				const dataPoint = lapData[lapDistance];
				const value = selector(dataPoint);
				values.push({
					x: lapDistance,
					y: value
				});
			});
			outputData.push(values);
		}

		return outputData;
	}, [lapData]);

	const lapTimeData = useMemo(() => getData([x => x.currentLapTimeInMS / 1000]), [getData]);
	const speedData = useMemo(() => getData([x => x.speed]), [getData]);
	const throttleData = useMemo(() => getData([x => x.throttle]), [getData]);
	const brakeData = useMemo(() => getData([x => x.brake]), [getData]);
	const steeringData = useMemo(() => getData([x => x.steering]), [getData]);
	const gearData = useMemo(() => getData([x => x.gear]), [getData]);
	const engineRPMData = useMemo(() => getData([x => x.engineRPM]), [getData]);
	const drsData = useMemo(() => getData([x => x.drs]), [getData]);
	const slipData = useMemo(() => getData([
		x => x.wheelSlip[TyreIds.FrontLeft],
		x => x.wheelSlip[TyreIds.FrontRight],
		x => x.wheelSlip[TyreIds.RearLeft],
		x => x.wheelSlip[TyreIds.RearRight]
	]), [getData]);

	return (
		<div>
			{!isLoading && !error &&
				<>
					<Button onClick={onResetZoomClicked}>Reset Zoom</Button>
					<LapDataChart dataSets={lapTimeData} yAxisLabel='Lap Time (s)' yAxisUnit='s' lineNames={['Lap Time']} />
					<LapDataChart dataSets={speedData} yAxisLabel='Speed (km/h)' yAxisUnit='km/h' lineNames={['Speed']} />
					<LapDataChart dataSets={throttleData} yAxisLabel='Throttle %' yAxisUnit='%' lineNames={['Throttle']} />
					<LapDataChart dataSets={brakeData} yAxisLabel='Brake %' yAxisUnit='%' lineNames={['Brake']} />
					<LapDataChart dataSets={steeringData} yAxisLabel='Steering' lineNames={['Steering']} />
					<LapDataChart dataSets={gearData} yAxisLabel='Gear' lineNames={['Gear']} />
					<LapDataChart dataSets={engineRPMData} yAxisLabel='Engine RPM' yAxisUnit='RPM' lineNames={['Engine RPM']} />
					<LapDataChart dataSets={drsData} yAxisLabel='DRS Activation' lineNames={['DRS']} />
					<LapDataChart dataSets={slipData} yAxisLabel='Wheel Slip' lineNames={tyreKeys} />
				</>
			}
			{isLoading && !error && <ScaleLoader />}
		</div>
	)
}

export default Lap;
