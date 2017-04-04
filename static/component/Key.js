import {Component} from 'react';
import {last, matches} from 'lodash';
import GlobalEvent from './GlobalEvent';
import {set} from 'san-update/fp';

const CONTROL = 17;
const ALT = 18;
const CMD = 91;
const META = 224;

let isSingleKey = matches({altKey: false, ctrlKey: false, metaKey: false});

let parseKeyPattern = pattern => {
    let names = pattern.split('+');
    return {
        altKey: names.includes('ALT'),
        keyCode: last(names).charCodeAt(0)
    };
};

let enterHelperMode = set('helperMode', true);
let leaveHelperMode = set('helperMode', false);

export default class Key extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // https://github.com/electron/electron/issues/9082
            helperMode: false,
            isMatch: matches(parseKeyPattern(props.pattern))
        };
    }

    onKeyDown({keyCode}) {
        if (keyCode === CMD || keyCode === CONTROL || keyCode === ALT || keyCode === META) {
            this.setState(enterHelperMode);
        }
    }

    onKeyUp(e) {
        let keyCode = e.keyCode;

        if (keyCode === CMD || keyCode === CONTROL || keyCode === ALT || keyCode === META) {
            this.setState(leaveHelperMode);
            return;
        }

        if (this.state.helperMode && isSingleKey(e)) {
            return;
        }

        if (this.state.isMatch(e)) {
            this.props.onTrigger();
        }
    }

    render() {
        return <GlobalEvent onKeyDown={::this.onKeyDown} onKeyUp={::this.onKeyUp} />;
    }
}
