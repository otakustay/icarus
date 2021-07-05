import styled from 'styled-components';
import {twoStopLinear} from '../utils/style';
import InteractiveElement from './InteractiveElement';

interface Props {
    active?: boolean;
    suggested?: boolean;
    disabled?: boolean;
    children: string;
    onClick?: () => void;
}

const linearOf = (state: 'default' | 'hover' | 'active') => {
    const statePart = state === 'default' ? '' : `-${state}`;

    return ({active, suggested, disabled}: Props) => {
        if (active || !suggested || disabled) {
            return 'none';
        }

        const color = `var(--color-${active || suggested ? 'primary' : 'secondary'}-background${statePart})`;
        return twoStopLinear('top', 4, color);
    };
};

const Layout = styled(InteractiveElement)<Props>`
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    background-image: ${linearOf('default')};
    cursor: ${({disabled}) => (disabled ? 'not-allowed' : 'pointer')};

    &:hover {
        background-image: ${linearOf('hover')};
    }

    &:active {
        background-image: ${linearOf('active')};
    }
`;

export default function Tag(props: Props) {
    const {active, disabled, children, onClick} = props;

    return (
        <Layout
            {...props}
            as="span"
            themeType={active && !disabled ? 'primary' : 'default'}
            onClick={onClick}
        >
            {children}
        </Layout>
    );
}
