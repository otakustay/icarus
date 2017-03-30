export default ({visible}) => (
    <div className="loading" style={{display: visible ? '' : 'none'}}>
        <div className="loading-progress"></div>
    </div>
);
