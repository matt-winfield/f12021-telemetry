import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Page } from '../models/page';
import Sidebar from './sidebar';
import Dashboard from './widgets/dashboard/dashboard';
import Tracks from './widgets/lap-explorer/tracks';
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
	const [page, setPage] = useState<Page>(Page.Dashboard);

	const getContent = () => {
		switch (page) {
			case Page.Dashboard:
				return <Dashboard />;
			case Page.SavedData:
				return <Tracks />;
			case Page.RawData:
				return <RawData />;
		}
	}

	const onPageChange = useCallback((page: Page) => {
		setPage(page);
	}, [])

	return (
		<Container>
			<Sidebar onChange={onPageChange} defaultPage={Page.Dashboard} />
			<ContentContainer>
				{getContent()}
			</ContentContainer>
		</Container>
	)
}

export default PageContainer;
