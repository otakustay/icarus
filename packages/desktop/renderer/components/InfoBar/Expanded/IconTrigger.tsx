import {ReactElement} from 'react';
import styled from 'styled-components';
import FlexCenter from '@/components/FlexCenter';

const Layout = styled(FlexCenter)`
    height: 100%;
    aspect-ratio: 1 / 1;
    cursor: pointer;

    &:hover {
        background-color: var(--color-element-contrast-background);
        color: var(--color-element-contrast-text);
    }
`;

interface Props {
    icon: ReactElement;
    onClick: () => void;
}

export default function IconTrigger({icon, onClick}: Props) {
    return (
        <Layout onClick={onClick}>
            {icon}
        </Layout>
    );
}
