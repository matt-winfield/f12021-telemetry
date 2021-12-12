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

type LapDataChartProps = {
	data: any[];
	dataKeys?: string[];
	xAxisLabel: string;
	yAxisLabel: string;
	xAxisUnit?: string;
	yAxisUnit?: string;
}

const margin = { top: 0, left: 30, right: 0, bottom: 30 };

const lineColors = ['#0037ff', '#ff4b4b', '#09ff00', '#6600ff', '#24b6ff', '#ff47a6', '#b0ff4f', '#d400ff']

const LapDataChart = ({ data, dataKeys, xAxisLabel, yAxisLabel, xAxisUnit, yAxisUnit }: LapDataChartProps) => {
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

	const formatTickLabel = useCallback((value: any) => `${value}${xAxisUnit ?? ''}`, [xAxisUnit])

	const formatTooltipLabel = useCallback((label: any) => `${xAxisLabel}: ${label}${xAxisUnit ?? ''}`, [xAxisLabel, xAxisUnit])

	const formatTooltip = useCallback((value: any) => `${value}${yAxisUnit ?? ''}`, [yAxisUnit])

	return (
		<Container>
			<LineChart
				width={1500}
				height={400}
				data={data}
				margin={margin}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}
			>
				<XAxis allowDataOverflow dataKey='lapDistance' type='number' tickCount={10} tickFormatter={formatTickLabel} domain={[left, right]}>
					<Label dy={15}>{xAxisLabel}</Label>
				</XAxis>
				<YAxis yAxisId='1'>
					<Label angle={270} dx={-20}>{yAxisLabel}</Label>
				</YAxis>
				<CartesianGrid strokeDasharray='4' />
				{dataKeys?.map((dataKey, index) => <Line type='linear' dataKey={dataKey} yAxisId='1' dot={false} connectNulls animationDuration={300} stroke={lineColors[index % 7]} />)}
				<Line type='linear' dataKey='value' yAxisId='1' dot={false} connectNulls animationDuration={300} stroke={lineColors[0]} />
				<Tooltip labelFormatter={formatTooltipLabel} formatter={formatTooltip} animationDuration={0} />
				{referenceAreaLeft && referenceAreaRight &&
					<ReferenceArea yAxisId='1' x1={referenceAreaLeft} x2={referenceAreaRight} />}
			</LineChart>
		</Container>
	)
}

export default LapDataChart
