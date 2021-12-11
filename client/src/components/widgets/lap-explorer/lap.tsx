import React, { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import { SavedDataProperties } from '../../../../../common/model/saved-data-properties';
import Api from '../../../logic/api';

const Lap = () => {
	const params = useParams();
	const { isLoading, error, data: lapData } = useQuery(['track', params.sessionUID, params.driverName, params.lapNumber], () => Api.fetchLapData(params.sessionUID ?? '', params.driverName ?? '', Number(params.lapNumber)));

	const getFormattedLapData = useCallback(() => {
		if (!lapData) return;
		return Object.keys(lapData).map(lapDistance => {
			const data = lapData[Number(lapDistance)];
			return <div>
				<h2>{lapDistance}</h2>
				{Object.keys(data).map(key => <div>{key} - {data[key as keyof SavedDataProperties]}</div>)}
			</div>
		})
	}, [lapData])

	return (
		<div>
			{!isLoading && !error && getFormattedLapData()}
			{isLoading && !error && <ScaleLoader />}
		</div>
	)
}

export default Lap
