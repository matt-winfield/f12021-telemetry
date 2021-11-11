import { useSelector } from "react-redux";
import { StoreState } from "../../store";

export const useMotionData = () => {
	return useSelector((state: StoreState) => state.liveData.motionData);
}

export const useSessionData = () => {
	return useSelector((state: StoreState) => state.liveData.sessionData);
}

export const useLapData = () => {
	return useSelector((state: StoreState) => state.liveData.lapData);
}

export const useEventData = () => {
	return useSelector((state: StoreState) => state.liveData.eventData);
}

export const useParticipantsData = () => {
	return useSelector((state: StoreState) => state.liveData.participantsData);
}

export const useCarSetupsData = () => {
	return useSelector((state: StoreState) => state.liveData.carSetupsData);
}

export const useCarTelemetryData = () => {
	return useSelector((state: StoreState) => state.liveData.carTelemetryData);
}