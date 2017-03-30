import {Component} from 'react';

const EVENTS = [
    ['keyup', 'onKeyUp'],
    ['dragover', 'onDragOver'],
    ['dragenter', 'onDragEnter'],
    ['dragleave', 'onDragLeave'],
    ['drop', 'onDrop']
];

export default class GlobalEvent extends Component {
    componentDidMount() {
        let events = EVENTS.filter(([eventName, methodName]) => !!this.props[methodName]);
        for (let [eventName, methodName] of events) {
            document.addEventListener(eventName, this.props[methodName], false);
        }
    }

    render() {
        return null;
    }
}
