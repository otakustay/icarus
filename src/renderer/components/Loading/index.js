import c from './index.less';

export default ({visible}) => (
    <div className={c.root} style={{display: visible ? '' : 'none'}}>
        <div className={c.progress} />
    </div>
);
