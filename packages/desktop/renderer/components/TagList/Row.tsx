import styled from 'styled-components';
import FlexCenter from '@/components/FlexCenter';
import {TagStateGroup} from './interface';
import Item from './Item';

const Layout = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 30px;
`;

const List = styled.ol`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 8px;
    padding: 4px 8px;
    flex-wrap: wrap;
`;

const Letter = styled(FlexCenter)`
    height: 100%;
    font-size: 20px;
    background-color: #4b545d;
    color: #fff;
`;

interface Props extends TagStateGroup {
    onTagActiveChange: (tagName: string, active: boolean) => void;
}

export default function TagRow({letter, tags, onTagActiveChange}: Props) {
    return (
        <Layout>
            <List>
                {tags.map(v => <Item key={v.name} {...v} onActiveChange={onTagActiveChange} />)}
            </List>
            <Letter>{letter}</Letter>
        </Layout>
    );
}
