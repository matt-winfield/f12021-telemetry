import React, { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import Api from '../../../logic/api';
import TrackFormatter from '../../../logic/track-formatter';
import { ApplicationRoutes } from '../../../models/application-routes';
import Button from '../../button';

const Track = () => {
	const navigate = useNavigate();
	const params = useParams();
	const { isLoading, error, data: laps } = useQuery(['track', params.trackId], () => Api.fetchTrackLaps(Number(params.trackId)),
		{
			refetchInterval: false,
			refetchOnWindowFocus: false,
			refetchIntervalInBackground: false
		});

	const onTrackClicked = useCallback((sessionUID: string, driverName: string, lapNumber: number) => {
		navigate(`/${ApplicationRoutes.Laps}/${sessionUID}/${driverName}/${lapNumber}`);
	}, [navigate])

	const getFormattedLaps = useCallback(() => {
		return laps?.map(lap => {
			return <Button onClick={() => onTrackClicked(lap.sessionUID, lap.driverName, lap.lapNumber)} key={`${lap.sessionUID}-${lap.driverName}-${lap.lapNumber}`}>
				{TrackFormatter.getTrackName(lap.trackId)} - {lap.driverName} - {lap.lapNumber}
			</Button>
		})
	}, [laps, onTrackClicked])

	return (
		<div>
			{!isLoading && !error && getFormattedLaps()}
			{isLoading && !error && <ScaleLoader />}
		</div>
	)
}

export default Track;
