import React, { ReactNode } from 'react';
import { useQuery } from 'react-query';
import { ScaleLoader } from 'react-spinners';
import Api from '../../../logic/api';
import TrackFormatter from '../../../logic/track-formatter';
import Track from './track';

const getFormattedTracks = (tracks?: number[]): ReactNode => {
	return tracks?.map(trackId => {
		return <Track key={trackId} name={TrackFormatter.getTrackName(trackId)} />;
	});
}

const Tracks = () => {
	const { isLoading, error, data: tracks } = useQuery('tracks', Api.fetchTracks);

	return (
		<div>
			<h2>Tracks</h2>
			{!isLoading && !error && getFormattedTracks(tracks)}
			{isLoading &&
				<ScaleLoader />
			}
		</div>
	)
}

export default Tracks
