import {FC, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {State} from '../../store';
import {toggleInfo} from '../../actions/panel';
import useViewState from '../../hooks/viewState';
import useKeyboard from '../../hooks/keyboard';
import {useIsReading} from '../../hooks/state';
import c from './index.less';

const Info: FC = () => {
    const visible = useSelector((s: State) => s.view.isInfoVisible);
    const archive = useSelector((s: State) => s.archive);
    const viewState = useViewState();
    const dispatch = useDispatch();
    const isReading = useIsReading();
    const toggleInfoPanel = useCallback(
        () => {
            if (isReading) {
                dispatch(toggleInfo());
            }
        },
        [dispatch, isReading]
    );
    useKeyboard('I', toggleInfoPanel);

    return (
        <div className={c('root', viewState)} style={{display: visible ? '' : 'none'}}>
            <span className={c.cursor}>
                {archive.index + 1}/{archive.total}
            </span>
            <div className={c.insideCurrent}>
                {archive.name}
            </div>
        </div>
    );
};

export default Info;
