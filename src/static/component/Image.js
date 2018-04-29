import {PureComponent} from 'react';
import {bind} from 'lodash-decorators';
import elementResizeDetector from 'element-resize-detector';
import {isReading} from '../selector';

export default class Image extends PureComponent {

    resizeDetector = elementResizeDetector({strategy: 'scroll'});

    container = null;

    @bind()
    enableResizeDetection(container) {
        if (this.container) {
            this.removeAllListeners(this.container);
        }

        this.resizeDetector.listenTo(
            container,
            element => {
                const size = {
                    width: element.offsetWidth,
                    height: element.offsetHeight
                };
                this.props.onSizeChange(size);
            }
        );
        this.container = container;
    }

    render() {
        if (!isReading(this.props)) {
            return <div className="image-container"></div>;
        }

        const {image, layout} = this.props;

        const transform = layout.steps[layout.stepIndex];
        const style = {
            transition: layout.transition ? 'transform 1s linear' : '',
            transform: `scale(${transform.scale}) translate3d(${transform.translateX}px, ${transform.translateY}px, 0)`
        };

        return (
            <div className="image-container" ref={this.enableResizeDetection}>
                <img className="image" src={image.uri} style={style} />
            </div>
        );
    }
}
