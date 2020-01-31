import {FC, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {State} from '../../store';
import {hideMessage} from '../../actions/notice';
import c from './index.less';

const Alert: FC = () => {
    const {visible, title, content} = useSelector((s: State) => s.message);
    const dispatch = useDispatch();
    useEffect(
        () => {
            if (visible) {
                const tick = window.setTimeout(() => dispatch(hideMessage()), 5 * 1000);
                return () => window.clearTimeout(tick);
            }
        },
        [dispatch, visible]
    );

    return (
        <div className={c.root} style={{display: visible ? '' : 'none'}}>
            <header className={c.title}>
                {title}
            </header>
            {
                content && (
                    <pre className={c.content} style={{display: content ? '' : 'none'}}>
                        {content}
                    </pre>
                )
            }
        </div>
    );
};

export default Alert;
