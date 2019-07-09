import {useToggle} from '../../hooks';
import c from './index.less';

export default ({visible, title, content}) => {
    const [isDetailVisible, toggleDetail] = useToggle(false);

    return (
        <div className={c.root} style={{display: visible ? '' : 'none'}}>
            <header className={c.title}>
                {title}
                {
                    content && (
                        <svg
                            viewBox="0 0 48 48"
                            className={c.toggle}
                            style={{transform: `rotate(${isDetailVisible ? '-90' : '90'}deg)`}}
                            onClick={toggleDetail}
                        >
                            <path d="M17.17 32.92l9.17-9.17-9.17-9.17 2.83-2.83 12 12-12 12z" />
                            <path d="M0-.25h48v48h-48z" fill="none" />
                        </svg>
                    )
                }
            </header>
            <pre className={c.content} style={{display: isDetailVisible ? '' : 'none'}}>
                {content}
            </pre>
        </div>
    );
};
