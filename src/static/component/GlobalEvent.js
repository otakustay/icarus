import {PureComponent} from 'react';

const EVENTS = [
    ['keydown', 'onKeyDown'],
    ['keyup', 'onKeyUp'],
    ['dragover', 'onDragOver'],
    ['dragenter', 'onDragEnter'],
    ['dragleave', 'onDragLeave'],
    ['drop', 'onDrop']
];

export default class GlobalEvent extends PureComponent {
    componentDidMount() {
        const events = EVENTS.filter(event => !!this.props[event[1]]);
        for (const [eventName, methodName] of events) {
            document.addEventListener(eventName, this.props[methodName], false);
        }
    }

    render() {
        return null;
    }
}
