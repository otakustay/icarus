import {FC, KeyboardEvent, useCallback, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useInputValue} from '@huse/input-value';
import {State} from '../../store';
import {toggleInfo} from '../../actions/panel';
import {moveArchive} from '../../actions/archive';
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
    const jumpInput = useRef<HTMLInputElement>(null);
    const jump = useInputValue('');
    const jumpArchive = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            e.stopPropagation();

            if (e.which !== 13) {
                return;
            }

            const index = parseInt(jump.value, 10);

            if (index > 0) {
                dispatch(moveArchive(index));
                jumpInput.current?.blur();
            }
        },
        [dispatch, jump.value]
    );

    return (
        <div className={c('root', viewState)} style={{display: visible ? '' : 'none'}}>
            <span className={c.cursor}>
                {archive.index + 1}/{archive.total}
                <input ref={jumpInput} className={c.jump} {...jump} onKeyDown={jumpArchive} />
            </span>
            <div className={c.insideCurrent}>
                {archive.name}
            </div>
        </div>
    );
};

export default Info;
