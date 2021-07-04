import styled from 'styled-components';
import Button from '@/components/Button';

const Layout = styled.div`
    display: flex;
    gap: 8px;
    flex-direction: row-reverse;
    justify-content: flex-start;
    cursor: pointer;
    padding-top: 12px;
`;

interface Props {
    onSubmit: () => void;
    onClear: () => void;
}

export default function FilterSubmit({onSubmit, onClear}: Props) {
    return (
        <Layout>
            <Button type="primary" onClick={onSubmit}>提交</Button>
            <Button onClick={onClear}>清空</Button>
        </Layout>
    );
}
