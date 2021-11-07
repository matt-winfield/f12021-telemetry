import React, { useState } from 'react'
import { formatDataValue } from '../logic/format-data-value';
import DataDisplay from './data-display';
import Tabs from './tabs';

export type ArrayDataDisplayProps = {
	data: any[];
}

const ArrayDataDisplay = (props: ArrayDataDisplayProps) => {
	const [selectedTab, setSelectedTab] = useState(0);

	const getElementForValue = (value: any): JSX.Element | string | number => {
		if (typeof value === 'string' || typeof value === 'number') {
			return <div>{formatDataValue(value)}</div>;
		}
		return <DataDisplay data={value}></DataDisplay>
	}

	const getDataDisplayElements = (): JSX.Element | string | number => {
		if (props.data.length > 4) {
			return <>
				<Tabs tabs={props.data.map((_, index) => index.toString())} onClick={(id) => setSelectedTab(id)}></Tabs>
				{getElementForValue(props.data[selectedTab])}
			</>
		}

		return <>
			{props.data.map(((value, index) =>
				<div key={index}>{getElementForValue(value)}</div>))}
		</>
	}

	return (
		<>
			{getDataDisplayElements()}
		</>
	)
}

export default ArrayDataDisplay;
