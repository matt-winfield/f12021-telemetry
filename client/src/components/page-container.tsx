import React, { useCallback, useState } from 'react'
import styled from 'styled-components';
import { Page } from '../models/page';
import Sidebar from './sidebar';
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
	const [page, setPage] = useState<Page>(Page.RawData);

	const getContent = () => {
		switch (page) {
			case Page.Dashboard:
				return <></>;
			case Page.RawData:
				return <RawData></RawData>;
		}
	}

	const onPageChange = useCallback((page: Page) => {
		setPage(page);
	}, [])

	return (
		<Container>
			<Sidebar onChange={onPageChange} defaultPage={Page.RawData} />
			<ContentContainer>
				{getContent()}
			</ContentContainer>
		</Container>
	)
}

export default PageContainer;
