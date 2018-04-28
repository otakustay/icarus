import {PureComponent} from 'react';
import moment from 'moment';

export default class Clock extends PureComponent {

    state = {
        time: moment()
    };

    componentDidMount() {
        const update = () => {
            const now = moment();

            this.setState({time: now});

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
