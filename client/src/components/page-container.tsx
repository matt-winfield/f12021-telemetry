import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { ApplicationRoutes } from '../models/application-routes';
import Sidebar from './sidebar';
import Dashboard from './widgets/dashboard/dashboard';
import Lap from './widgets/lap-explorer/lap';
import Track from './widgets/lap-explorer/track';
import TrackList from './widgets/lap-explorer/track-list';
import RawData from './widgets/raw-data/raw-data';

const Container = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
`;

const ContentContainer = styled.div`
	overflow: auto;
	padding: 10px;
	flex-grow: 1;
`;

const PageContainer = () => {
	return (
		<Container>
			<BrowserRouter>
				<Sidebar />
				<ContentContainer>
					<Routes>
						<Route index element={<Dashboard />} />
						<Route path={ApplicationRoutes.Dashboard} element={<Dashboard />} />
						<Route path={ApplicationRoutes.Tracks} element={<TrackList />} />
						<Route path={`${ApplicationRoutes.Tracks}/:trackId`} element={<Track />} />
						<Route path={`${ApplicationRoutes.Laps}/:sessionUID/:driverName/:lapNumber`} element={<Lap />} />
						<Route path={ApplicationRoutes.RawData} element={<RawData />} />
					</Routes>
				</ContentContainer>
			</BrowserRouter>
		</Container>
	)
}

export default PageContainer;
