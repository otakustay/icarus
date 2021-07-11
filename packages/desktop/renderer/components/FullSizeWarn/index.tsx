import {ReactElement, CSSProperties} from 'react';
import styled from '@emotion/styled';
import FlexCenter from '@/components/FlexCenter';

const Layout = styled(FlexCenter)`
    width: 100%;
    height: 100%;
    flex-direction: column;
    color: var(--color-panel-text);
`;

interface Props {
    size?: number;
    icon: ReactElement<{style: CSSProperties}>;
    description: string;
    detail?: string;
}

export default function FullSizeWarn({size = 48, icon, description, detail}: Props) {
    return (
        <Layout style={{fontSize: size}}>
            {icon}
            <p style={{fontSize: size / 3}}>{description}</p>
            <p style={{fontSize: 12, color: 'var(--color-panel-text-secondary)'}}>{detail}</p>
        </Layout>
    );
}
