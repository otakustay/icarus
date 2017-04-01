import {Component} from 'react';
import GlobalEvent from './GlobalEvent';
import {set} from 'san-update/fp';

const CONTROL = 17;
const ALT = 18;
const CMD = 91;
const META = 224;

let enterHelperMode = set('helperMode', true);
let leaveHelperMode = set('helperMode', false);

export default class Key extends Component {
    state = {
        helperMode: false
    };

    onKeyDown({keyCode}) {
        if (keyCode === CMD || keyCode === CONTROL || keyCode === ALT || keyCode === META) {
            this.setState(enterHelperMode);
        }
    }

    onKeyUp({keyCode}) {
        if (keyCode === CMD || keyCode === CONTROL || keyCode === ALT || keyCode === META) {
            this.setState(leaveHelperMode);
            return;
        }

        if (!this.state.helperMode && keyCode === this.props.char.charCodeAt(0)) {
            this.props.onTrigger();
        }
    }

    render() {
        return <GlobalEvent onKeyDown={::this.onKeyDown} onKeyUp={::this.onKeyUp} />;
    }
}
