import { useState } from 'react';
import { useLapData, useMotionData, useSessionData } from '../hooks/selectors/live-data-selectors';
import useLiveDataConnection from '../hooks/use-live-data-connection';
import DataDisplay from './data-display';
import Tabs from './tabs';

const dataTabs = ["Motion", "Session", "Lap Data", "Event", "Participants", "Car Setups", "Car Telemetry", "Car Status", "Final Classification", "Lobby Info", "Car Damage", "Session History"];

const LiveData = () => {
	const motionData = useMotionData();
	const sessionData = useSessionData();
	const lapData = useLapData();
	const [selectedTab, setSelectedTab] = useState(0);
	useLiveDataConnection(selectedTab);

	const getLiveData = () => {
		switch (selectedTab) {
			case 0:
				return motionData;
			case 1:
				return sessionData;
			case 2:
				return lapData;
		}
		return undefined;
	}

	return (
		<div>
			<Tabs tabs={dataTabs} onClick={(tabId) => setSelectedTab(tabId)}></Tabs>
			<DataDisplay data={getLiveData()}></DataDisplay>
		</div>
	)
}

export default LiveData;
