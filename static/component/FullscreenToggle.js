import {Component} from 'react';

export default class FullscreenToggle extends Component {
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
