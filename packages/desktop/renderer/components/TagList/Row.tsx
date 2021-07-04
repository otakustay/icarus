import styled from 'styled-components';
import FlexCenter from '@/components/FlexCenter';
import {TagStateGroup} from './interface';
import Item from './Item';
import {INITIAL_LETTER_BACKGROUND_COLOR, INITIAL_LETTER_WIDTH} from './dicts';
import {useTagListNoPadding} from './StatusContextProvider';

const Layout = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr ${INITIAL_LETTER_WIDTH};
`;

interface PaddingProps {
    noPadding: boolean;
}

const List = styled.ol<PaddingProps>`
    list-style: none;
    margin: 0;
    display: flex;
    gap: 8px;
    padding: ${({noPadding}) => (noPadding ? '4px 0' : '4px 8px')};
    flex-wrap: wrap;
`;

const Letter = styled(FlexCenter)`
    height: 100%;
    font-size: 20px;
    background-color: ${INITIAL_LETTER_BACKGROUND_COLOR};
    color: #fff;
`;

interface Props extends TagStateGroup {
    onTagActiveChange: (tagName: string, active: boolean) => void;
}

export default function TagRow({letter, tags, onTagActiveChange}: Props) {
    const noPadding = useTagListNoPadding();

    return (
        <Layout>
            <List noPadding={noPadding}>
                {tags.map(v => <Item key={v.name} {...v} onActiveChange={onTagActiveChange} />)}
            </List>
            <Letter>{letter}</Letter>
        </Layout>
    );
}
