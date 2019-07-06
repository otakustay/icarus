import c from './index.less';

export default ({visible, viewStates, archive, imageName}) => (
    <div className={c('root', viewStates)} style={{display: visible ? '' : 'none'}}>
        <span>[{archive.index + 1}/{archive.total}]</span>
        <span>{archive.name}</span>
        <span className={c.image}>{imageName ? '/' + imageName : ''}</span>
    </div>
);
