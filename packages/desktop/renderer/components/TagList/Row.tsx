import styled from 'styled-components';
import FlexCenter from '@/components/FlexCenter';
import {TagStateGroup} from './interface';
import Item from './Item';

const Layout = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 40px;
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
    font-size: 24px;
    background-color: #4b545d;
    color: #fff;
`;

export default function TagRow({letter, tags}: TagStateGroup) {
    return (
        <Layout>
            <List>
                {tags.map(v => <Item key={v.name} {...v} />)}
            </List>
            <Letter>{letter}</Letter>
        </Layout>
    );
}
