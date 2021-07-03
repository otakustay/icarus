import styled from 'styled-components';

const Bar = styled.div`
    position: relative;
    height: 4px;
    border-radius: 2px;
    background-color: #666;
    overflow: visible;
`;

const Indicator = styled.i`
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #ddd;
`;

interface Props {
    total: number;
    current: number;
}

export default function ImageProgressIndicator({total, current}: Props) {
    const stop = `${current / total * 100}%`;
    const gradient = `
        to right,
        #74a201,
        #abc600 ${stop},
        transparent ${stop}
    `;

    return (
        <Bar style={{backgroundImage: `linear-gradient(${gradient})`}}>
            <Indicator style={{left: stop}} />
        </Bar>
    );
}
