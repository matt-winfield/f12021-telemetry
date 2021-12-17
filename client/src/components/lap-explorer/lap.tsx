import React, { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import styled from 'styled-components';
import { TyreIds } from '../../../../common/constants/tyre-ids';
import { SavedDataProperties } from '../../../../common/model/saved-data-properties';
import Api from '../../logic/api';
import { resetDataMax, resetZoom, updateDataMax } from '../../slices/chart-slice';
import { Button } from '../button/button';
import TrackMap, { Coordinate } from '../track-map/track-map';
import LapDataChart, { ChartDataPoint } from './lap-data-chart';

const tyreKeys = ['Front Left', 'Front Right', 'Rear Left', 'Rear Right'];

const Container = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
`

const GraphContainer = styled.div`
	flex-grow: 1;
	height: 100%;
	overflow-y: auto;
`

const Sidebar = styled.div`
	width: 300px;
	padding: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
`

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

	useEffect(() => {
		dispatch(resetDataMax());
	}, [dispatch])

	const getData = useCallback((selectors: ((dataPoint: SavedDataProperties) => number)[]): ChartDataPoint[][] => {
		if (!lapData) return [];

		let outputData: ChartDataPoint[][] = [];

		let maxLapDistance = 0;
		for (const selector of selectors) {
			const values: ChartDataPoint[] = [];
			// eslint-disable-next-line no-loop-func
			Object.keys(lapData).forEach(key => {
				const lapDistance = Number(key);
				const dataPoint = lapData[lapDistance];
				const value = selector(dataPoint);
				maxLapDistance = Math.max(maxLapDistance, lapDistance);

				values.push({
					x: lapDistance,
					y: value
				});
			});
			outputData.push(values);
		}

		dispatch(updateDataMax(maxLapDistance));
		return outputData;
	}, [lapData, dispatch]);

	const getPositionData = useMemo(() => {
		let outputData: { [lapDistance: number]: Coordinate } = {};

		if (!lapData) return [];

		Object.keys(lapData).forEach(key => {
			const lapDistance = Number(key);
			const dataPoint = lapData[lapDistance];

			outputData[lapDistance] = {
				x: dataPoint.worldPositionX,
				y: dataPoint.worldPositionZ
			};
		});

		return outputData;
	}, [lapData])

	const lapTimeData = useMemo(() => getData([x => x.currentLapTimeInMS / 1000]), [getData]);
	const speedData = useMemo(() => getData([x => x.speed]), [getData]);
	const throttleData = useMemo(() => getData([x => x.throttle * 100]), [getData]);
	const brakeData = useMemo(() => getData([x => x.brake * 100]), [getData]);
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
		<Container>
			{!isLoading && !error &&
				<>
					<GraphContainer>
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
					</GraphContainer>
					<Sidebar>
						<TrackMap data={getPositionData} padding={5} />
					</Sidebar>
				</>
			}
			{isLoading && !error && <ScaleLoader />}
		</Container>
	)
}

export default Lap;
