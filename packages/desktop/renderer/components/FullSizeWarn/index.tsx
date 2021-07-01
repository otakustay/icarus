import {ReactElement, CSSProperties} from 'react';
import styled from 'styled-components';
import FlexCenter from '@/components/FlexCenter';

const Layout = styled(FlexCenter)`
    width: 100%;
    height: 100%;
    flex-direction: column;
    color: #ddd;
`;

interface Props {
    size?: number;
    icon: ReactElement<{style: CSSProperties}>;
    description: string;
}

export default function FullSizeWarn({size = 48, icon, description}: Props) {
    return (
        <Layout style={{fontSize: size}}>
            {icon}
            <p style={{fontSize: size / 3}}>{description}</p>
        </Layout>
    );
}
