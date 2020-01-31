import {useState, useEffect, useRef, FC, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import {endTiming} from '../../actions/notice';
import useKeyboard from '../../hooks/keyboard';
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
            return () => window.clearTimeout(timer.current);
        },
        []
    );
    return time;
};

const Clock: FC = () => {
    const [begin, beginTiming] = useState(0);
    const time = useTime();
    const dispatch = useDispatch();
    const finishTiming = useCallback(
        () => {
            const totalSeconds = (Date.now() - begin) / 1000;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = Math.floor(totalSeconds % 60);
            if (minutes > 0 || seconds > 5) {
                dispatch(endTiming({minutes, seconds}));
            }
        },
        [begin, dispatch]
    );
    const toggleTiming = useCallback(
        () => (begin ? finishTiming() : beginTiming(Date.now())),
        [begin, finishTiming]
    );
    useKeyboard('C', toggleTiming);

    return (
        <div className={c.root}>
            <span className={c.stopwatch} style={{display: begin ? '' : 'none'}}>*</span>
            <span className={c.time}>{time.format('HH:mm')}</span>
        </div>
    );
};

export default Clock;
