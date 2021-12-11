import React, { ReactNode, useCallback } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import Api from '../../../logic/api';
import TrackFormatter from '../../../logic/track-formatter';
import Button from '../../button';

const TrackList = () => {
	const { isLoading, error, data: tracks } = useQuery('tracks', Api.fetchTracks,
		{
			refetchInterval: false,
			refetchOnWindowFocus: false,
			refetchIntervalInBackground: false
		});
	const navigate = useNavigate();

	const onTrackClicked = useCallback((trackId: number): void => {
		navigate(trackId.toString());
	}, [navigate])

	const getFormattedTracks = useCallback((): ReactNode => {
		return tracks?.map(trackId => {
			return <Button key={trackId} onClick={() => onTrackClicked(trackId)}>{TrackFormatter.getTrackName(trackId)}</Button>;
		});
	}, [tracks, onTrackClicked]);

	return (
		<div>
			<h2>Tracks</h2>
			{!isLoading && !error && getFormattedTracks()}
			{isLoading && !error && <ScaleLoader />}
		</div>
	)
}

export default TrackList
