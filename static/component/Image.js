import {Component} from 'react';
import {findDOMNode} from 'react-dom';
import elementResizeDetector from 'element-resize-detector';
import {isReading} from '../selector';

export default class Image extends Component {

    componentDidMount() {
        let container = findDOMNode(this);
        let detector = elementResizeDetector({strategy: 'scroll'});
        detector.listenTo(
            container,
            () => {
                let size = {
                    width: container.offsetWidth,
                    height: container.offsetHeight
                };
                this.props.onSizeChange(size);
            }
        );
    }

    render() {
        if (!isReading(this.props)) {
            return <div className="image-container"></div>;
        }

        let {image, layout} = this.props;

        let transform = layout.steps[layout.stepIndex];
        let style = {
            transition: layout.transition ? 'transform 1s linear' : '',
            transform: `scale(${transform.scale}) translate3d(${transform.translateX}px, ${transform.translateY}px, 0)`
        };

        return (
            <div className="image-container">
                <img className="image" src={image.uri} style={style} />
            </div>
        );
    }
}
