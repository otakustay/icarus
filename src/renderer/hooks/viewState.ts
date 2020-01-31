import {useSelector} from 'react-redux';
import {State} from '../store';

export default function useViewState() {
    const fullscreen = useSelector((s: State) => s.view.isFullscreen);
    const tag = useSelector((s: State) => s.view.isTagVisible);
    const info = useSelector((s: State) => s.view.isInfoVisible);
    return {fullscreen, tag, info};
}
