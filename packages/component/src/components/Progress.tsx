import {useState, useCallback, HTMLAttributes} from 'react';
import styled from 'styled-components';
import {useSwitch} from '@huse/boolean';
import {useElementSize} from '@huse/element-size';
import Draggable, {DraggableEvent, DraggableData} from 'react-draggable';
import {twoStopLinear} from '../utils/style';

const Wrapper = styled.div`
    height: 12px;
`;

const Bar = styled.div`
    position: relative;
    height: 4px;
    border-radius: 2px;
    transform: translateY(4px);
    background-color: var(--color-panel-text-secondary);
    overflow: visible;
`;

const IndicatorDot = styled.i`
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    overflow: visible;
    border-radius: 50%;
    background-color: var(--color-panel-text);
`;

const ValueHint = styled.span`
    position: absolute;
    top: 0;
    left: 50%;
    font-size: 12px;
    white-space: nowrap;
    transform: translate(-50%, -100%);
`;

interface IndicatorProps extends HTMLAttributes<HTMLElement> {
    currentLabelVisible: boolean;
    current: number;
}

function CurrentIndicator({currentLabelVisible, current, ...props}: IndicatorProps) {
    return (
        <IndicatorDot {...props}>
            {currentLabelVisible && <ValueHint>{current}</ValueHint>}
        </IndicatorDot>
    );
}

export interface Props {
    total: number;
    current: number;
    onChange?: (value: number) => void;
}

function ProgressIndicator({total, current, onChange}: Props) {
    const [barRef, barSize] = useElementSize();
    const [isDragging, startDrag, endDrag] = useSwitch();
    const [currentHint, setCurrentHint] = useState(current + 1);
    const snapGridSize = barSize ? Math.round(barSize.width / (total - 1)) : 0;
    const updateDraggingValue = useCallback(
        (e: DraggableEvent, data: DraggableData) => {
            const value = Math.round(data.x / snapGridSize);
            setCurrentHint(value + 1);
        },
        [snapGridSize]
    );
    const notifyChange = useCallback(
        (e: DraggableEvent, data: DraggableData) => {
            endDrag();
            const value = Math.round(data.x / snapGridSize);
            onChange && onChange(value);
        },
        [endDrag, onChange, snapGridSize]
    );
    const gradient = twoStopLinear(
        'right',
        `${current * snapGridSize}px`,
        {
            start: 'var(--color-vivid-dark)',
            end: 'var(--color-vivid-light)',
        }
    );

    return (
        <Wrapper style={{cursor: isDragging ? 'grabbing' : 'initial'}}>
            <Bar ref={barRef} style={{backgroundImage: gradient}}>
                <Draggable
                    axis="x"
                    grid={[snapGridSize, 0]}
                    bounds="parent"
                    position={{x: current * snapGridSize, y: 0}}
                    positionOffset={{x: '-50%', y: '-50%'}}
                    onStart={startDrag}
                    onDrag={updateDraggingValue}
                    onStop={notifyChange}
                >
                    <CurrentIndicator
                        style={{cursor: isDragging ? 'grabbing' : 'grab'}}
                        currentLabelVisible={isDragging}
                        current={currentHint}
                    />
                </Draggable>
            </Bar>
        </Wrapper>
    );
}

export default function Progress(props: Props) {
    return <ProgressIndicator key={props.current} {...props} />;
}
