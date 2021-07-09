import {useMemo} from 'react';
import styled from '@emotion/styled';
import {IoFileTrayOutline} from 'react-icons/io5';
import {twoStopLinear} from '@icarus/component';
import FullSizeWarn from '@/components/FullSizeWarn';
import StatusContextProvider from './StatusContextProvider';
import Row from './Row';
import {groupTagsByLetter, TagGroup} from './utils';
import {TagState} from './interface';
import {INITIAL_LETTER_WIDTH} from './dicts';

// 背景色保持和`Row`右边放首字母的一条一样的背景色和宽度
const Layout = styled.div`
    width: 100%;
    background-image: ${twoStopLinear('left', INITIAL_LETTER_WIDTH, 'var(--color-secondary-background-active)')}
`;

interface TagStateGroup {
    letter: string;
    tags: TagState[];
}

interface Props {
    className?: string;
    disabled?: boolean;
    noPadding?: boolean;
    showEmpty: boolean;
    tagNames: string[];
    activeTagNames: string[];
    suggestedTagNames?: string[];
    onTagActiveChange: (tagName: string, active: boolean) => void;
}

export default function TagList(props: Props) {
    const {
        className,
        disabled = false,
        noPadding = false,
        showEmpty,
        tagNames,
        activeTagNames,
        suggestedTagNames = [],
        onTagActiveChange,
    } = props;
    const groups = useMemo(
        () => {
            const groups = groupTagsByLetter(tagNames);
            const injectActiveState = (group: TagGroup): TagStateGroup => {
                const toTagState = (name: string): TagState => {
                    return {
                        name,
                        active: activeTagNames.includes(name),
                        suggested: suggestedTagNames.includes(name),
                    };
                };
                return {
                    letter: group.letter,
                    tags: group.tagNames.map(toTagState),
                };
            };
            return groups.map(injectActiveState);
        },
        [activeTagNames, suggestedTagNames, tagNames]
    );

    return (
        <Layout className={className}>
            <StatusContextProvider disabled={disabled} noPadding={noPadding}>
                {
                    groups.length || !showEmpty
                        ? groups.map(v => <Row key={v.letter} {...v} onTagActiveChange={onTagActiveChange} />)
                        : <FullSizeWarn icon={<IoFileTrayOutline />} description="还没有任何标签" />
                }
            </StatusContextProvider>
        </Layout>
    );
}
