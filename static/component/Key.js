import {Component} from 'react';
import GlobalEvent from './GlobalEvent';

export default class Key extends Component {
    onKeyUp(e) {
        if (e.keyCode === this.props.char.charCodeAt(0)) {
            this.props.onTrigger();
        }
    }

    render() {
        return <GlobalEvent onKeyUp={::this.onKeyUp} />;
    }
}
