import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CartesianGrid, Label, Line, LineChart, ReferenceArea, Tooltip, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import { updateZoom } from '../../../slices/chart-slice';
import { StoreState } from '../../../store';

const Container = styled.div`
	display: flex;
	align-items: flex-start;
`

export type ChartDataPoint = {
	x: number;
	y: number;
}

type LapDataChartProps = {
	data: ChartDataPoint[][];
	lineNames: string[];
	yAxisLabel: string;
	yAxisUnit?: string;
}

const margin = { top: 0, left: 30, right: 0, bottom: 50 };

const lineColors = ['#0037ff', '#ff4b4b', '#09ff00', '#6600ff', '#24b6ff', '#ff47a6', '#b0ff4f', '#d400ff']

const LapDataChart = ({ data, lineNames, yAxisLabel, yAxisUnit }: LapDataChartProps) => {
	const dispatch = useDispatch();
	const [referenceAreaLeft, setReferenceAreaLeft] = useState('');
	const [referenceAreaRight, setReferenceAreaRight] = useState('');
	const [isDragging, setIsDragging] = useState(false);

	const left = useSelector((state: StoreState) => state.charts.zoomStart);
	const right = useSelector((state: StoreState) => state.charts.zoomEnd);

	const onMouseDown = useCallback((e: any) => {
		if (!e) return;
		setReferenceAreaLeft(e.activeLabel);
		setIsDragging(true);
	}, []);

	const onMouseMove = useCallback((e: any) => {
		if (isDragging) {
			setReferenceAreaRight(e.activeLabel);
		}
	}, [isDragging]);

	const onMouseUp = useCallback((e: any) => {
		let newLeft = referenceAreaLeft;
		let newRight = referenceAreaRight;

		if (newLeft === newRight || newRight === '') {
			setReferenceAreaLeft('');
			setReferenceAreaRight('');
			return;
		}

		if (newLeft > newRight) {
			[newLeft, newRight] = [newRight, newLeft];
		}

		setReferenceAreaLeft('');
		setReferenceAreaRight('');
		dispatch(updateZoom(newLeft, newRight));
		setIsDragging(false);
	}, [referenceAreaLeft, referenceAreaRight, dispatch]);

	const formatTooltipLabel = useCallback((label: any) => `Lap Distance: ${label}m`, [])

	return (
		<Container>
			<LineChart
				width={1500}
				height={400}
				margin={margin}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}
				syncId='1'
			>
				<XAxis allowDataOverflow dataKey='x' interval='preserveStartEnd' type='number' unit='m' tickCount={10} domain={[left, right]}>
					<Label dy={15}>Lap Distance</Label>
				</XAxis>
				<YAxis yAxisId='1' type='number' domain={['dataMin', 'dataMax']}>
					<Label angle={270} dx={-20}>{yAxisLabel}</Label>
				</YAxis>
				<CartesianGrid strokeDasharray='4' />
				{data.map((series, index) => <Line key={index} data={series} name={lineNames[index]} dataKey='y' yAxisId='1' dot={false} connectNulls animationDuration={1000} stroke={lineColors[index % 7]} unit={yAxisUnit} />)}
				<Tooltip labelFormatter={formatTooltipLabel} animationDuration={0} />
				{referenceAreaLeft && referenceAreaRight &&
					<ReferenceArea yAxisId='1' x1={referenceAreaLeft} x2={referenceAreaRight} />}
			</LineChart>
		</Container>
	)
}

export default LapDataChart
