import {PureComponent} from 'react';
import {last, matches} from 'lodash';
import {set} from 'san-update/fp';
import {bind} from 'lodash-decorators';
import GlobalEvent from './GlobalEvent';

const CONTROL = 17;
const ALT = 18;
const CMD = 91;
const META = 224;

const isSingleKey = matches({altKey: false, ctrlKey: false, metaKey: false});

const parseKeyPattern = pattern => {
    const names = pattern.split('+');
    return {
        altKey: names.includes('ALT'),
        keyCode: last(names).charCodeAt(0),
    };
};

const enterHelperMode = set('helperMode', true);
const leaveHelperMode = set('helperMode', false);

export default class Key extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            // https://github.com/electron/electron/issues/9082
            helperMode: false,
            isMatch: matches(parseKeyPattern(props.pattern)),
        };
    }

    @bind()
    onKeyDown({keyCode}) {
        if (keyCode === CMD || keyCode === CONTROL || keyCode === ALT || keyCode === META) {
            this.setState(enterHelperMode);
        }
    }

    @bind()
    onKeyUp(e) {
        const keyCode = e.keyCode;

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
        return <GlobalEvent onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp} />;
    }
}
