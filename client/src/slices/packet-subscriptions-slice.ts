import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PacketIds } from "../../../common/constants/packet-ids";

type SliceState = {
	subscriptions: { [key in PacketIds]?: string[] },
}

const initialState: SliceState = {
	subscriptions: {}
}

type ModifyPacketSubscriptionPayload = {
	packetId: PacketIds,
	subscriptionId: string
}

const prepareModifyPacketSubscriptionPayload = (packetId: PacketIds, subscriptionId: string) => {
	return {
		payload: { packetId, subscriptionId }
	};
}

export const packetSubscriptionsSlice = createSlice({
	name: 'live-data',
	initialState,
	reducers: {
		addPacketSubscription: {
			reducer: (state, action: PayloadAction<ModifyPacketSubscriptionPayload>) => {
				const { packetId, subscriptionId } = action.payload;

				if (!state.subscriptions[packetId]) {
					state.subscriptions[packetId] = [];
				}

				state.subscriptions[packetId]?.push(subscriptionId)
			},
			prepare: prepareModifyPacketSubscriptionPayload
		},
		removePacketSubscription: {
			reducer: (state, action: PayloadAction<ModifyPacketSubscriptionPayload>) => {
				const { packetId, subscriptionId } = action.payload;

				state.subscriptions[packetId] = state.subscriptions[packetId]?.filter(value => value !== subscriptionId);
			},
			prepare: prepareModifyPacketSubscriptionPayload
		}
	}
});

export const { addPacketSubscription, removePacketSubscription } = packetSubscriptionsSlice.actions;
export default packetSubscriptionsSlice.reducer;