import {FC, useCallback, useReducer} from 'react';
import {useDispatch} from 'react-redux';
import classNames from 'classnames';
import {restoreState} from '../../actions/open';
import useKeyboard from '../../hooks/keyboard';
import useViewState from '../../hooks/viewState';
import useFullscreen from '../../hooks/fullscreen';
import DropZone from '../DropZone';
import Image from '../Image';
import Clock from '../Clock';
import Info from '../Info';
import ArchiveTagList from '../ArchiveTagList';
import Alert from '../Alert';
import Loading from '../Loading';
import DisturbMode from '../DisturbMode';
import Filter from '../Filter';
import Help from '../Help';

const App: FC = () => {
    const viewState = useViewState();
    const dispatch = useDispatch();
    const restore = useCallback(
        () => dispatch(restoreState()),
        [dispatch]
    );
    const [fullscreen, toggleFullscreen] = useReducer((v: boolean) => !v, false);
    useFullscreen(fullscreen);
    useKeyboard('R', restore);
    useKeyboard('F', toggleFullscreen);

    return (
        <div id="main" style={{width: '100%', height: '100%'}} data-view-state={classNames(viewState)}>
            <DropZone />
            <Image />
            <Clock />
            <Info />
            <ArchiveTagList />
            <Alert />
            <Loading />
            <Filter />
            <DisturbMode />
            <Help />
        </div>
    );
};

export default App;
