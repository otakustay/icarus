import {useState, useLayoutEffect} from 'react';
import elementResizeDetector from 'element-resize-detector';
import c from './index.less';

const resizeDetector = elementResizeDetector({strategy: 'scroll'});

export default ({image, layout, viewStates, onSizeChange}) => {
    const [root, setRoot] = useState(null);
    useLayoutEffect(
        () => {
            if (!root) {
                return;
            }

            resizeDetector.listenTo(
                root,
                element => {
                    const size = {
                        width: element.offsetWidth,
                        height: element.offsetHeight,
                    };
                    onSizeChange(size);
                }
            );
            // eslint-disable-next-line consistent-return
            return () => resizeDetector.uninstall(root);
        },
        [root, onSizeChange]
    );

    if (!image.uri) {
        return <div className={c.root}></div>;
    }

    const transform = layout.steps[layout.stepIndex];
    const style = {
        transition: layout.transition ? 'transform 1s linear' : '',
        transform: `scale(${transform.scale}) translate3d(${transform.translateX}px, ${transform.translateY}px, 0)`,
    };

    return (
        <div className={c('root', viewStates)} ref={setRoot}>
            <img className={c.image} src={image.uri} style={style} />
        </div>
    );
};
