import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import { useRecoilState, useResetRecoilState } from 'recoil';
import styled from 'styled-components';
import { TyreIds } from '../../../../common/constants/tyre-ids';
import { LapData, LapInfo } from '../../../../common/model/lap-info';
import { SavedDataProperties } from '../../../../common/model/saved-data-properties';
import Api from '../../logic/api';
import { maxLapDistanceAtom, zoomEndAtom, zoomStartAtom } from '../../slices/chart-slice';
import { Button } from '../button/button';
import ReferenceDataSelector from '../reference-data-selector/reference-data-selector';
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

type LapLinesData = {
	speedData: ChartDataPoint[][],
	throttleData: ChartDataPoint[][],
	brakeData: ChartDataPoint[][],
	steeringData: ChartDataPoint[][],
	gearData: ChartDataPoint[][],
	engineRPMData: ChartDataPoint[][],
	drsData: ChartDataPoint[][],
	slipData: ChartDataPoint[][]
}

const initialData: LapLinesData = {
	speedData: [],
	throttleData: [],
	brakeData: [],
	steeringData: [],
	gearData: [],
	engineRPMData: [],
	drsData: [],
	slipData: []
}

const Lap = () => {
	const params = useParams();
	const [referenceLapInfo, setReferenceLapInfo] = useState<LapInfo>()
	const resetZoomStart = useResetRecoilState(zoomStartAtom);
	const resetZoomEnd = useResetRecoilState(zoomEndAtom);
	const [, setMaxLapDistance] = useRecoilState(maxLapDistanceAtom);
	const resetMaxLapDistance = useResetRecoilState(maxLapDistanceAtom);
	const [lapLinesData, setLapLinesData] = useState(initialData);
	const [referenceLapLinesData, setReferenceLapLinesData] = useState(initialData);

	const { isLoading, error, data: lapData } = useQuery(
		['track', params.sessionUID, params.driverName, params.lapNumber],
		() => Api.fetchLapData(params.sessionUID ?? '', params.driverName ?? '', Number(params.lapNumber)),
		{
			refetchInterval: false,
			refetchOnWindowFocus: false,
			refetchIntervalInBackground: false
		});

	const { data: referenceLapData } = useQuery(
		['track', referenceLapInfo?.sessionUID, referenceLapInfo?.driverName, referenceLapInfo?.lapNumber],
		() => Api.fetchLapData(referenceLapInfo?.sessionUID ?? '', referenceLapInfo?.driverName ?? '', Number(referenceLapInfo?.lapNumber)),
		{
			refetchInterval: false,
			refetchOnWindowFocus: false,
			refetchIntervalInBackground: false,
			enabled: referenceLapInfo !== undefined
		});

	const onResetZoomClicked = useCallback(() => {
		resetZoomStart();
		resetZoomEnd();
	}, [resetZoomStart, resetZoomEnd]);

	useEffect(() => {
		resetMaxLapDistance();
	}, [resetMaxLapDistance])

	const onReferenceLapChanged = useCallback((lapInfo?: LapInfo) => {
		setReferenceLapInfo(lapInfo);
	}, [])

	const getData = useCallback((selectors: ((dataPoint: SavedDataProperties) => number)[], lapData?: LapData): ChartDataPoint[][] => {
		if (!lapData) return [];

		let outputData: ChartDataPoint[][] = [];

		let newMaxLapDistance = 0;
		for (const selector of selectors) {
			const values: ChartDataPoint[] = [];
			// eslint-disable-next-line no-loop-func
			Object.keys(lapData.data).forEach(key => {
				const lapDistance = Number(key);
				const dataPoint = lapData.data[lapDistance];
				const value = selector(dataPoint);
				newMaxLapDistance = Math.max(newMaxLapDistance, lapDistance);

				values.push({
					x: lapDistance,
					y: value
				});
			});
			outputData.push(values);
		}
		return outputData;
	}, []);

	const getPositionData = useCallback((lapData?: LapData) => {
		let outputData: { [lapDistance: number]: Coordinate } = {};

		if (!lapData) return [];

		Object.keys(lapData.data).forEach(key => {
			const lapDistance = Number(key);
			const dataPoint = lapData.data[lapDistance];

			outputData[lapDistance] = {
				x: dataPoint.worldPositionX,
				y: dataPoint.worldPositionZ
			};
		});

		return outputData;
	}, [])

	const queryData = useCallback((data?: LapData) => {
		return {
			lapTimeData: getData([x => x.currentLapTimeInMS / 1000], data),
			speedData: getData([x => x.speed], data),
			throttleData: getData([x => x.throttle * 100], data),
			brakeData: getData([x => x.brake * 100], data),
			steeringData: getData([x => x.steering], data),
			gearData: getData([x => x.gear], data),
			engineRPMData: getData([x => x.engineRPM], data),
			drsData: getData([x => x.drs], data),
			slipData: getData([
				x => x.wheelSlip[TyreIds.FrontLeft],
				x => x.wheelSlip[TyreIds.FrontRight],
				x => x.wheelSlip[TyreIds.RearLeft],
				x => x.wheelSlip[TyreIds.RearRight]
			], data)
		};
	}, [getData]);

	useEffect(() => {
		if (lapData) {
			const lapLinesData = queryData(lapData);
			setLapLinesData(lapLinesData);
			setMaxLapDistance(Math.max(...Object.keys(lapData.data).map(Number)));
		}
	}, [lapData, queryData, setLapLinesData, setMaxLapDistance])

	useEffect(() => {
		if (referenceLapData) {
			const lapLinesData = queryData(referenceLapData);
			setLapLinesData(lapLinesData);
			setMaxLapDistance(Math.max(...Object.keys(referenceLapData.data).map(Number)));
		}
	}, [referenceLapData, queryData, setLapLinesData, setMaxLapDistance])

	const positionData = useMemo(() => getPositionData(lapData), [getPositionData, lapData]);
	const referencePositionData = useMemo(() => getPositionData(referenceLapData), [getPositionData, referenceLapData]);

	const standardLineNames = useMemo(() => [params.driverName ?? '', referenceLapInfo?.driverName ?? ''], [params.driverName, referenceLapInfo?.driverName])
	const tyreLineNames = useMemo(
		() => [
			...tyreKeys.map(key => `${params.driverName ?? ''} ${key}`),
			...tyreKeys.map(key => `${referenceLapInfo?.driverName ?? ''} ${key}`)
		],
		[params.driverName, referenceLapInfo?.driverName]);

	return (
		<Container>
			{!isLoading && !error &&
				<>
					<GraphContainer>
						<LapDataChart dataSets={[...lapLinesData.speedData, ...referenceLapLinesData.speedData]} yAxisLabel='Speed (km/h)' yAxisUnit='km/h' lineNames={standardLineNames} />
						<LapDataChart dataSets={[...lapLinesData.throttleData, ...referenceLapLinesData.throttleData]} yAxisLabel='Throttle %' yAxisUnit='%' lineNames={standardLineNames} />
						<LapDataChart dataSets={[...lapLinesData.brakeData, ...referenceLapLinesData.brakeData]} yAxisLabel='Brake %' yAxisUnit='%' lineNames={standardLineNames} />
						<LapDataChart dataSets={[...lapLinesData.steeringData, ...referenceLapLinesData.steeringData]} yAxisLabel='Steering' lineNames={standardLineNames} />
						<LapDataChart dataSets={[...lapLinesData.gearData, ...referenceLapLinesData.gearData]} yAxisLabel='Gear' lineNames={standardLineNames} />
						<LapDataChart dataSets={[...lapLinesData.engineRPMData, ...referenceLapLinesData.engineRPMData]} yAxisLabel='Engine RPM' yAxisUnit='RPM' lineNames={standardLineNames} />
						<LapDataChart dataSets={[...lapLinesData.drsData, ...referenceLapLinesData.drsData]} yAxisLabel='DRS Activation' lineNames={standardLineNames} />
						<LapDataChart dataSets={[...lapLinesData.slipData, ...referenceLapLinesData.slipData]} yAxisLabel='Wheel Slip' lineNames={tyreLineNames} />
					</GraphContainer>
					<Sidebar>
						<Button onClick={onResetZoomClicked}>Reset Zoom</Button>
						<TrackMap lines={[positionData, referencePositionData]} padding={5} />
						{lapData &&
							<ReferenceDataSelector trackId={lapData.lapInfo.trackId} onReferenceDataChange={onReferenceLapChanged}>
								Select Reference Data
							</ReferenceDataSelector>}
					</Sidebar>
				</>
			}
			{isLoading && !error && <ScaleLoader />}
		</Container>
	)
}

export default Lap;
