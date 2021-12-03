import React, { useMemo, useState } from 'react'
import { formatDataValue } from '../../logic/format-data-value';
import DataDisplay from './data-display';
import Tabs from '../tabs';

export type ArrayDataDisplayProps = {
	data: any[];
}

const ArrayDataDisplay = ({ data }: ArrayDataDisplayProps) => {
	const [selectedTab, setSelectedTab] = useState(0);

	const tabNames = useMemo(() => {
		return [...Array(data.length).keys()].map(n => n.toString());
	}, [data.length])

	const getElementForValue = (value: any): JSX.Element | string | number => {
		if (typeof value === 'string' || typeof value === 'number') {
			return <div>{formatDataValue(value)}</div>;
		}
		return <DataDisplay data={value}></DataDisplay>
	}

	const getDataDisplayElements = (): JSX.Element | string | number => {
		if (data.length > 4) {
			return <>
				<Tabs tabs={tabNames} onClick={setSelectedTab}></Tabs>
				{getElementForValue(data[selectedTab])}
			</>
		}

		return <>
			{data.map(((value, index) =>
				<div key={index}>{getElementForValue(value)}</div>))}
		</>
	}

	return (
		<>
			{getDataDisplayElements()}
		</>
	)
}

export default React.memo(ArrayDataDisplay);
