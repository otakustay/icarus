import {useMemo} from 'react';
import styled from 'styled-components';
import {IoFileTrayOutline} from 'react-icons/io5';
import FullSizeWarn from '@/components/FullSizeWarn';
import StatusContextProvider from './StatusContextProvider';
import Row from './Row';
import {groupTagsByLetter, TagGroup} from './utils';
import {TagState} from './interface';

const Layout = styled.div`
    overflow: auto;
    display: flex;
    flex-direction: column;
    background-color: #353535;
`;

interface TagStateGroup {
    letter: string;
    tags: TagState[];
}

interface Props {
    disabled: boolean;
    showEmpty: boolean;
    tagNames: string[];
    activeTagNames: string[];
    onTagActiveChange: (tagName: string, active: boolean) => void;
}

export default function TagList({disabled, showEmpty, tagNames, activeTagNames, onTagActiveChange}: Props) {
    const groups = useMemo(
        () => {
            const groups = groupTagsByLetter(tagNames);
            const injectActiveState = (group: TagGroup): TagStateGroup => {
                return {
                    letter: group.letter,
                    tags: group.tagNames.map(name => ({name, active: activeTagNames.includes(name)})),
                };
            };
            return groups.map(injectActiveState);
        },
        [activeTagNames, tagNames]
    );

    return (
        <Layout>
            <StatusContextProvider disabled={disabled}>
                {
                    groups.length || !showEmpty
                        ? groups.map(v => <Row key={v.letter} {...v} onTagActiveChange={onTagActiveChange} />)
                        : <FullSizeWarn icon={<IoFileTrayOutline />} description="还没有任何标签" />
                }
            </StatusContextProvider>
        </Layout>
    );
}
