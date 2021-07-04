import styled from 'styled-components';
import {twoStopLinear} from '@/utils/style';

const Bar = styled.div`
    position: relative;
    height: 4px;
    border-radius: 2px;
    background-color: var(--color-panel-text);
    overflow: visible;
`;

const Indicator = styled.i`
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--color-panel-contrast-text);
`;

interface Props {
    total: number;
    current: number;
}

export default function ImageProgressIndicator({total, current}: Props) {
    const stop = `${current / total * 100}%`;
    const gradient = twoStopLinear(
        'right',
        stop,
        {
            start: 'var(--color-primary-element-background)',
            end: 'var(--color-primary-element-contrast-background)',
        }
    );

    return (
        <Bar style={{backgroundImage: gradient}}>
            <Indicator style={{left: stop}} />
        </Bar>
    );
}
