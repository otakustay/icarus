import {Component} from 'react';
import {findDOMNode} from 'react-dom';
import elementResizeDetector from 'element-resize-detector';

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
        let {image, layout} = this.props;

        if (!image.uri) {
            return <div className="image-container"></div>;
        }

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
