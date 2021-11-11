import { useState } from 'react';
import { useEventData, useLapData, useMotionData, useParticipantsData, useSessionData } from '../hooks/selectors/live-data-selectors';
import useLiveDataConnection from '../hooks/use-live-data-connection';
import DataDisplay from './data-display';
import Tabs from './tabs';

const dataTabs = ["Motion", "Session", "Lap Data", "Event", "Participants", "Car Setups", "Car Telemetry", "Car Status", "Final Classification", "Lobby Info", "Car Damage", "Session History"];

const LiveData = () => {
	const motionData = useMotionData();
	const sessionData = useSessionData();
	const lapData = useLapData();
	const eventData = useEventData();
	const participantsData = useParticipantsData();
	const [selectedTab, setSelectedTab] = useState(0);
	useLiveDataConnection();

	const getLiveData = () => {
		switch (selectedTab) {
			case 0:
				return motionData;
			case 1:
				return sessionData;
			case 2:
				return lapData;
			case 3:
				return eventData;
			case 4:
				return participantsData;
		}
		return undefined;
	}

	return (
		<div>
			<Tabs tabs={dataTabs} onClick={setSelectedTab}></Tabs>
			<DataDisplay data={getLiveData()}></DataDisplay>
		</div>
	)
}

export default LiveData;
