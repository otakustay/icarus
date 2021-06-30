import {useEffect, useState, useRef, useMemo} from 'react';
import styled from 'styled-components';
import ipc from '@/ipc/tag';
import {useReadingBook} from '../ReadingContextProvider';
import Empty from './Empty';
import Row from './Row';
import {groupTagsByLetter, TagGroup} from './utils';
import {TagState} from './interface';

const Layout = styled.div`
    width: 340px;
    min-width: 340px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    padding: 8px 0;
    background-color: #353535;
`;

interface TagStateGroup {
    letter: string;
    tags: TagState[];
}

export default function TagList() {
    const book = useReadingBook();
    const latestBookNameRef = useRef(book.name);
    const [allTagNames, setAllTagNames] = useState<string[]>([]);
    const [activeTagNames, setActiveTagNames] = useState(new Set<string>());
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
    useEffect(
        () => {
            latestBookNameRef.current = book.name;
            (async () => {
                const [activeTagNames, allTagNames] = await Promise.all([ipc.tagsByBook(book.name), ipc.listAll()]);
                if (book.name === latestBookNameRef.current) {
                    setAllTagNames(allTagNames);
                    setActiveTagNames(new Set(activeTagNames));
                }
            })();
        },
        [book.name]
    );

    if (!allTagNames.length) {
        return (
            <Layout>
                <Empty />
            </Layout>
        );
    }

    return (
        <Layout>
            {groups.map(v => <Row key={v.letter} {...v} />)}
        </Layout>
    );
}
