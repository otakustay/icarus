import {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import c from './index.less';

const useTime = () => {
    const [time, sync] = useState(() => moment());
    const timer = useRef(null);
    useEffect(
        () => {
            const update = () => {
                const now = moment();
                sync(now);
                timer.current = setTimeout(update, (60 - now.second()) * 1000);
            };
            update();
            return () => clearTimeout(timer.current);
        },
        []
    );
    return time;
};

export default ({isTiming}) => {
    const time = useTime();

    return (
        <div className={c.root}>
            <span className={c.stopwatch} style={{display: isTiming ? '' : 'none'}}>*</span>
            <span className={c.time}>{time.format('HH:mm')}</span>
        </div>
    );
};
