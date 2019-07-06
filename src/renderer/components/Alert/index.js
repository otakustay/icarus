import c from './index.less';

export default ({visible, content}) => <div className={c.root} style={{display: visible ? '' : 'none'}}>{content}</div>;
