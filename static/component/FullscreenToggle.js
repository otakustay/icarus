import {PureComponent} from 'react';

export default class FullscreenToggle extends PureComponent {
    componentDidUpdate() {
        if (this.props.isFullscreen) {
            document.documentElement.webkitRequestFullScreen();
        }
        else {
            document.webkitCancelFullScreen();
        }
    }

    render() {
        return null;
    }
}
