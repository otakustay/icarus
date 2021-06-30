import styled from 'styled-components';
import {IoFileTrayOutline} from 'react-icons/io5';
import FlexCenter from '@/components/FlexCenter';

const Layout = styled(FlexCenter)`
    width: 100%;
    height: 100%;
    flex-direction: column;
    color: #ddd;
`;

const EmptyIcon = styled(IoFileTrayOutline)`
    font-size: 48px;
`;

export default function TagListEmpty() {
    return (
        <Layout>
            <EmptyIcon />
            <p>还没有任何标签</p>
        </Layout>
    );
}
