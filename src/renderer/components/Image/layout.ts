import {atom, useRecoilValue, useSetRecoilState} from 'recoil';

export type LayoutType = 'topBottom' | 'oneStep' | 'adaptive';

const state = atom<LayoutType>({key: 'Layout', default: 'adaptive'});

export const useLayoutType = () => useRecoilValue(state);

export const useChangeLayout = () => useSetRecoilState(state);
