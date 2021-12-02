import { nanoid } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PacketIds } from '../../../../common/constants/packet-ids';
import { addPacketSubscription, removePacketSubscription } from '../../slices/packet-subscriptions-slice';
import { StoreState } from "../../store";

const usePacketSubscription = (packetId: PacketIds) => {
	const dispatch = useDispatch();
	useEffect(() => {
		const subscriptionId = nanoid();
		dispatch(addPacketSubscription(packetId, subscriptionId));
		return () => {
			dispatch(removePacketSubscription(packetId, subscriptionId));
		}
	}, [packetId, dispatch])
}

export const useMotionData = () => {
	usePacketSubscription(PacketIds.Motion);
	return useSelector((state: StoreState) => state.liveData.motion);
}

export const useSessionData = () => {
	usePacketSubscription(PacketIds.Session);
	return useSelector((state: StoreState) => state.liveData.session);
}

export const useLapData = () => {
	usePacketSubscription(PacketIds.LapData);
	return useSelector((state: StoreState) => state.liveData.lap);
}

export const useEventData = () => {
	usePacketSubscription(PacketIds.Event);
	return useSelector((state: StoreState) => state.liveData.event);
}

export const useParticipantsData = () => {
	usePacketSubscription(PacketIds.Participants);
	return useSelector((state: StoreState) => state.liveData.participants);
}

export const useCarSetups = () => {
	usePacketSubscription(PacketIds.CarSetups);
	return useSelector((state: StoreState) => state.liveData.carSetups);
}

export const useCarTelemetry = () => {
	usePacketSubscription(PacketIds.CarTelemetry);
	return useSelector((state: StoreState) => state.liveData.carTelemetry);
}

export const useCarStatus = () => {
	usePacketSubscription(PacketIds.CarStatus);
	return useSelector((state: StoreState) => state.liveData.carStatus);
}

export const useFinalClassificationData = () => {
	usePacketSubscription(PacketIds.FinalClassification);
	return useSelector((state: StoreState) => state.liveData.finalClassification);
}

export const useLobbyInfo = () => {
	usePacketSubscription(PacketIds.LobbyInfo);
	return useSelector((state: StoreState) => state.liveData.lobbyInfo);
}

export const useCarDamageData = () => {
	usePacketSubscription(PacketIds.CarDamage)
	return useSelector((state: StoreState) => state.liveData.carDamage);
}

export const useSessionHistory = () => {
	usePacketSubscription(PacketIds.SessionHistory);
	return useSelector((state: StoreState) => state.liveData.sessionHistory);
}