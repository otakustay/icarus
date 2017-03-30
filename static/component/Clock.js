import {Component} from 'react';
import moment from 'moment';

export default class Clock extends Component {

    state = {
        time: moment()
    };

    componentDidMount() {
        let update = () => {
            let now = moment();

            this.setState(state => ({time: now}));

            setTimeout(update, (60 - now.second()) * 1000);
        };

        update();
    }

    render() {
        return (
            <div className="clock">
                <span className="stopwatch-indicator" style={{display: this.props.isTiming ? '' : 'none'}}>*</span>
                <span className="clock-time">{this.state.time.format('HH:mm')}</span>
            </div>
        );
    }
}
