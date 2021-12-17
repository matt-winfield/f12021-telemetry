import { ActiveElement, CategoryScale, Chart, ChartData, ChartEvent, ChartTypeRegistry, InteractionModeMap, Legend, LinearScale, LineElement, PointElement, ScatterController, ScatterDataPoint, Tick, Title, Tooltip, TooltipItem } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Mode } from 'chartjs-plugin-zoom/types/options';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { roundToDecimalPlaces } from '../../../../common/helpers/number-helpers';
import { updateActiveLapDistance, updateZoom } from '../../slices/chart-slice';
import { StoreState } from '../../store';

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

const verticalCursorScatterChartId = 'verticalCursorScatterChart';
class VerticalCursorScatterChart extends ScatterController {
	public static id: string = verticalCursorScatterChartId;
	public static defaults = ScatterController.defaults;

	public draw = (): void => {
		super.draw();

		const activeElements = this.chart.tooltip?.getActiveElements();

		if (activeElements !== undefined && activeElements.length > 0) {
			let activePoint = activeElements[0],
				ctx = this.chart.ctx,
				x = activePoint.element.tooltipPosition().x,
				topY = this.chart.scales['y']?.top,
				bottomY = this.chart.scales['y']?.bottom;

			ctx.save();
			ctx.beginPath();
			ctx.moveTo(x, topY);
			ctx.lineTo(x, bottomY);
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#38acff39';
			ctx.stroke();
			ctx.restore();
		}
	}
}

declare module 'chart.js' {
	interface ChartTypeRegistry {
		[verticalCursorScatterChartId]: ChartTypeRegistry['scatter']
	}
}

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
	const dispatch = useDispatch();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const chartRef = useRef<Chart>();
	const zoomStart = useSelector((state: StoreState) => state.charts.zoomStart);
	const zoomEnd = useSelector((state: StoreState) => state.charts.zoomEnd);
	const dataMax = useSelector((state: StoreState) => state.charts.dataMax);

	const onZoomOrPan = useCallback((context: { chart: Chart }) => {
		const scale = context.chart.scales['x'];
		dispatch(updateZoom(scale.min, scale.max));
	}, [dispatch]);

	const onHover = useCallback((event: ChartEvent, activeElements: ActiveElement[], chart: Chart) => {
		if (activeElements.length < 1) {
			dispatch(updateActiveLapDistance(undefined));
			return;
		}

		const activeElement = activeElements[0];
		const dataPoint = chart.data.datasets[activeElement.datasetIndex].data[activeElement.index] as ScatterDataPoint;
		dispatch(updateActiveLapDistance(dataPoint.x));
	}, [dispatch])

	const getXAxisTickLabel = useCallback((value: string | number, index: number, ticks: Tick[]) => `${roundToDecimalPlaces(Number(value), 1)}m`, [])
	const getTooltipTitle = useCallback((items: TooltipItem<keyof ChartTypeRegistry>[]) => `${(items[0].raw as ChartDataPoint).x}m`, []);
	const getTooltipLabel = useCallback((item: TooltipItem<keyof ChartTypeRegistry>) => `${item.dataset.label}: ${item.formattedValue}${yAxisUnit ?? ''}`, [yAxisUnit])

	const options = useMemo(() => ({
		responsive: true,
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
			mode: 'index' as keyof InteractionModeMap,
			intersect: false
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
				max: dataMax
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
	}), [dataMax, onZoomOrPan, onHover, getXAxisTickLabel, getTooltipTitle, getTooltipLabel, yAxisLabel]);

	useEffect(() => {
		const data: ChartData = {
			datasets: []
		}

		dataSets.forEach((dataSet, index) => {
			data.datasets.push({
				label: lineNames[index],
				data: dataSet,
				showLine: true,
				borderColor: lineColors[index % 7],
				backgroundColor: lineColors[index % 7]
			})
		})

		if (canvasRef.current) {
			chartRef.current = new Chart(canvasRef.current, {
				type: verticalCursorScatterChartId,
				data,
				options
			});
		}

		return () => {
			chartRef.current?.destroy();
		}
	}, [dataSets, lineNames, options]);

	useEffect(() => {
		if (chartRef.current && zoomStart !== undefined && zoomEnd !== undefined) {
			chartRef.current.zoomScale('x', { min: zoomStart, max: zoomEnd });
		} else if (chartRef.current) {
			chartRef.current.zoomScale('x', { min: 0, max: dataMax })
		}
	}, [zoomStart, zoomEnd, dataMax]);

	return (
		<Container>
			<canvas ref={canvasRef}></canvas>
		</Container>
	)
}

export default LapDataChart;