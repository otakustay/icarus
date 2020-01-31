import {useState, useEffect, useRef, FC, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import {State} from '../../store';
import useKeyboard from '../../hooks/keyboard';
import {startTiming, finishTiming} from '../../actions/panel';
import c from './index.less';

const useTime = () => {
    const [time, sync] = useState(() => moment());
    const timer = useRef<number | undefined>();
    useEffect(
        () => {
            const update = () => {
                const now = moment();
                sync(now);
                timer.current = window.setTimeout(update, (60 - now.second()) * 1000);
            };
            update();
            return () => clearTimeout(timer.current);
        },
        []
    );
    return time;
};

const Clock: FC = () => {
    const time = useTime();
    const timingBegin = useSelector((s: State) => s.timing.begin);
    const dispatch = useDispatch();
    const toggleTiming = useCallback(
        () => dispatch(timingBegin ? finishTiming(timingBegin) : startTiming()),
        [dispatch, timingBegin]
    );
    useKeyboard('C', toggleTiming);

    return (
        <div className={c.root}>
            <span className={c.stopwatch} style={{display: timingBegin ? '' : 'none'}}>*</span>
            <span className={c.time}>{time.format('HH:mm')}</span>
        </div>
    );
};

export default Clock;
