export default ({visible, archiveName, imageName}) => (
    <div className="info" style={{display: visible ? '' : 'none'}}>
        <span className="info-path">{archiveName}</span>
        <span className="info-image">{imageName ? '/' + imageName : ''}</span>
    </div>
);
