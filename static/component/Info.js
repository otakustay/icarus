export default ({visible, archive, imageName}) => (
    <div className="info" style={{display: visible ? '' : 'none'}}>
        <span className="info-progress">[{archive.index}/{archive.total}]</span>
        <span className="info-path">{archive.name}</span>
        <span className="info-image">{imageName ? '/' + imageName : ''}</span>
    </div>
);
