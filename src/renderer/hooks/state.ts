import {useSelector} from 'react-redux';
import {State} from '../store';

export const useIsReading = () => useSelector((s: State) => !!s.image.uri);
