import { ActiveElement, CategoryScale, Chart, ChartData, ChartEvent, ChartTypeRegistry, InteractionModeMap, Legend, LinearScale, LineElement, PointElement, ScatterDataPoint, Tick, Title, Tooltip, TooltipItem } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Mode } from 'chartjs-plugin-zoom/types/options';
import deepEqual from 'deep-equal';
import React, { useCallback, useEffect, useRef } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import styled from 'styled-components';
import { roundToDecimalPlaces } from '../../../../common/helpers/number-helpers';
import { activeLapDistanceAtom, maxLapDistanceAtom, zoomEndAtom, zoomStartAtom } from '../../slices/chart-slice';
import { VerticalCursorScatterChart, verticalCursorScatterChartId } from './vertical-cursor-scatter-chart';

const Container = styled.div`
	width: 100%;
	height: 500px;
	position: relative;
`

export type ChartDataPoint = {
	x: number;
	y: number;
}

type LapDataChartProps = {
	dataSets: ChartDataPoint[][];
	lineNames: string[];
	yAxisLabel: string;
	yAxisUnit?: string;
}

const lineColors = ['#0037ff', '#ff4b4b', '#09ff00', '#6600ff', '#24b6ff', '#ff47a6', '#b0ff4f', '#d400ff']

Chart.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	VerticalCursorScatterChart,
	zoomPlugin
);

const LapDataChart = ({ dataSets, lineNames, yAxisLabel, yAxisUnit }: LapDataChartProps) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const chartRef = useRef<Chart>();
	const [zoomStart, setZoomStart] = useRecoilState(zoomStartAtom);
	const [zoomEnd, setZoomEnd] = useRecoilState(zoomEndAtom);
	const [, updateActiveLapDistance] = useRecoilState(activeLapDistanceAtom);
	const resetActiveLapDistance = useResetRecoilState(activeLapDistanceAtom);
	const [maxLapDistance] = useRecoilState(maxLapDistanceAtom);

	const onZoomOrPan = useCallback((context: { chart: Chart }) => {
		const scale = context.chart.scales['x'];
		setZoomStart(scale.min);
		setZoomEnd(scale.max);
	}, [setZoomStart, setZoomEnd]);

	const onHover = useCallback((event: ChartEvent, activeElements: ActiveElement[], chart: Chart) => {
		if (activeElements.length < 1) {
			resetActiveLapDistance();
			return;
		}

		const activeElement = activeElements[0];
		const dataPoint = chart.data.datasets[activeElement.datasetIndex].data[activeElement.index] as ScatterDataPoint;
		updateActiveLapDistance(dataPoint.x);
	}, [updateActiveLapDistance, resetActiveLapDistance])

	const getXAxisTickLabel = useCallback((value: string | number, index: number, ticks: Tick[]) => `${roundToDecimalPlaces(Number(value), 1)}m`, [])
	const getTooltipTitle = useCallback((items: TooltipItem<keyof ChartTypeRegistry>[]) => `${(items[0].raw as ChartDataPoint).x}m`, []);
	const getTooltipLabel = useCallback((item: TooltipItem<keyof ChartTypeRegistry>) => `${item.dataset.label}: ${item.formattedValue}${yAxisUnit ?? ''}`, [yAxisUnit])

	const options = useRef({
		responsive: true,
		spanGaps: true,
		maintainAspectRatio: false,
		layout: {
			padding: 20
		},
		elements: {
			point: {
				radius: 0
			},
			line: {
				tension: 0,
				borderWidth: 1
			}
		},
		tooltips: {
			axis: 'x'
		},
		interaction: {
			mode: 'nearest' as keyof InteractionModeMap,
			intersect: false,
			axis: 'x' as const
		},
		onHover: onHover,
		scales: {
			x: {
				title: {
					display: true,
					text: 'Lap Distance'
				},
				ticks: {
					callback: getXAxisTickLabel
				},
				min: 0,
				max: maxLapDistance
			},
			y: {
				title: {
					display: true,
					text: yAxisLabel
				}
			}
		},
		plugins: {
			legend: {
				position: 'right' as const
			},
			tooltip: {
				callbacks: {
					title: getTooltipTitle,
					label: getTooltipLabel
				}
			},
			zoom: {
				pan: {
					enabled: true,
					mode: 'x' as Mode,
					onPanComplete: onZoomOrPan
				},
				zoom: {
					wheel: {
						enabled: true,
						modifierKey: 'ctrl' as const
					},
					pinch: {
						enabled: true
					},
					drag: {
						enabled: true,
						modifierKey: 'ctrl' as const
					},
					mode: 'x' as Mode,
					onZoomComplete: onZoomOrPan
				},
				limits: {
					x: { min: 'original' as const, max: 'original' as const }
				}
			}
		}
	});

	const data = useRef<ChartData>({
		datasets: []
	});

	useEffect(() => {
		if (maxLapDistance <= 0) return;

		options.current.onHover = onHover;
		options.current.scales.x.ticks.callback = getXAxisTickLabel;
		options.current.scales.x.max = maxLapDistance;
		options.current.scales.y.title.text = yAxisLabel;
		options.current.plugins.tooltip.callbacks.title = getTooltipTitle;
		options.current.plugins.tooltip.callbacks.label = getTooltipLabel;
		options.current.plugins.zoom.pan.onPanComplete = onZoomOrPan;
		options.current.plugins.zoom.zoom.onZoomComplete = onZoomOrPan;
		chartRef.current?.update('none');
	}, [maxLapDistance, onZoomOrPan, onHover, getXAxisTickLabel, getTooltipTitle, getTooltipLabel, yAxisLabel])

	useEffect(() => {
		if (dataSets.length < 1) return;

		if (dataSets.length === data.current.datasets.length) {
			for (let i = 0; i < dataSets.length; i++) {
				let newDataSet = dataSets[i];
				let oldDataSet = data.current.datasets[i].data;
				if (deepEqual(newDataSet, oldDataSet)) {
					return;
				}
			}
		}

		data.current.datasets = [];

		dataSets.forEach((dataSet, index) => {
			data.current.datasets.push({
				label: lineNames[index],
				data: dataSet,
				showLine: true,
				borderColor: lineColors[index % 8],
				backgroundColor: lineColors[index % 8]
			})
		})

		chartRef.current?.update('none');
	}, [dataSets, lineNames])

	useEffect(() => {
		if (canvasRef.current) {
			chartRef.current = new Chart(canvasRef.current, {
				type: verticalCursorScatterChartId,
				data: data.current,
				options: options.current
			});
		}

		return () => {
			chartRef.current?.destroy();
		}
	}, []);

	useEffect(() => {
		if (!chartRef.current) return;
		if (zoomStart === null && zoomEnd === null
			&& chartRef.current.scales['x'].min === 0 && chartRef.current.scales['x'].max === maxLapDistance) {
			return;
		}

		if (zoomStart !== null && zoomEnd !== null) {
			chartRef.current.zoomScale('x', { min: zoomStart, max: zoomEnd }, 'none');
			return;
		}

		chartRef.current.zoomScale('x', { min: 0, max: maxLapDistance }, 'none')
	}, [zoomStart, zoomEnd, maxLapDistance]);

	return (
		<Container>
			<canvas ref={canvasRef}></canvas>
		</Container>
	)
}

export default LapDataChart;
