import {useMemo} from 'react';
import styled from 'styled-components';
import {IoFileTrayOutline} from 'react-icons/io5';
import FullSizeWarn from '@/components/FullSizeWarn';
import {useReadingBookUnsafe} from '@/components/ReadingContextProvider';
import StatusContextProvider from './StatusContextProvider';
import Row from './Row';
import {groupTagsByLetter, TagGroup} from './utils';
import {TagState} from './interface';
import {useBookTagData, useToggleTagActive} from './hooks';

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

// TODO: 标签推荐功能
// TODO: 新建标签

interface Props {
    disabled: boolean;
}

export default function TagList({disabled}: Props) {
    const book = useReadingBookUnsafe();
    const [{allTagNames, activeTagNames}, reloadTagData, pending] = useBookTagData(book?.name);
    const toggleTagActive = useToggleTagActive(book?.name, {active: activeTagNames, onComplete: reloadTagData});
    const groups = useMemo(
        () => {
            const groups = groupTagsByLetter(allTagNames);
            const injectActiveState = (group: TagGroup): TagStateGroup => {
                return {
                    letter: group.letter,
                    tags: group.tagNames.map(name => ({name, active: activeTagNames.has(name)})),
                };
            };
            return groups.map(injectActiveState);
        },
        [activeTagNames, allTagNames]
    );

    return (
        <Layout>
            <StatusContextProvider disabled={disabled}>
                {
                    groups.length || pending
                        ? groups.map(v => <Row key={v.letter} {...v} onItemClick={toggleTagActive} />)
                        : <FullSizeWarn icon={<IoFileTrayOutline />} description="还没有任何标签" />
                }
            </StatusContextProvider>
        </Layout>
    );
}
