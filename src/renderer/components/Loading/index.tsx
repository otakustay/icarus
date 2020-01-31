import {FC} from 'react';
import {useSelector} from 'react-redux';
import {State} from '../../store';
import c from './index.less';

const Loading: FC = () => {
    const visible = useSelector((s: State) => s.view.isLoading);
    return (
        <div className={c.root} style={{display: visible ? '' : 'none'}}>
            <div className={c.progress} />
        </div>
    );
};

export default Loading;
