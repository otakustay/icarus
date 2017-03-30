export default ({image, layout}) => {
    if (!image.uri) {
        return null;
    }

    let transform = layout.steps[layout.stepIndex];
    let style = {
        transition: layout.transition ? 'transform 1s linear' : '',
        transform: `scale(${transform.scale}) translate3d(${transform.translateX}px, ${transform.translateY}px, 0)`
    };

    return <img className="image" src={image.uri} style={style} />;
};
