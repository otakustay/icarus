import {FC, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {toggleDisturbMode} from '../../actions/panel';
import useKeyboard from '../../hooks/keyboard';
import {State} from '../../store';
import c from './index.less';

const DisturbMode: FC = () => {
    const visible = useSelector((s: State) => s.view.isDisturbing);
    const dispatch = useDispatch();
    const toggle = useCallback(
        () => dispatch(toggleDisturbMode()),
        [dispatch]
    );
    useKeyboard(' ', toggle);

    if (!visible) {
        return null;
    }

    const src = 'https://www.taobao.com';
    return <iframe className={c.root} src={src} />;
};

export default DisturbMode;
