import { atom } from 'recoil';

export const zoomStartAtom = atom<number | null>({
	key: 'zoomStart',
	default: null
});

export const zoomEndAtom = atom<number | null>({
	key: 'zoomEnd',
	default: null
});

export const activeLapDistanceAtom = atom<number | null>({
	key: 'activeLapDistance',
	default: null
});

export const maxLapDistanceAtom = atom<number>({
	key: 'maxLapDistance',
	default: 0
});