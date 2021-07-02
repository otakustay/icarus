import styled from 'styled-components';
import {IoFileTrayOutline} from 'react-icons/io5';
import FullSizeWarn from '@/components/FullSizeWarn';
import {useReadingBookUnsafe} from '@/components/ReadingContextProvider';
import TagList from '@/components/TagList';
import {useBookTagData, useToggleTagActive} from './hooks';

const Layout = styled.div`
    overflow: auto;
    display: flex;
    flex-direction: column;
    background-color: #353535;
`;

// TODO: 标签推荐功能
// TODO: 新建标签

interface Props {
    disabled: boolean;
}

export default function BookTagList({disabled}: Props) {
    const book = useReadingBookUnsafe();
    const [{allTagNames, activeTagNames}, reloadTagData, pending] = useBookTagData(book?.name);
    const toggleTagActive = useToggleTagActive(book?.name, reloadTagData);

    return (
        <Layout>
            {
                allTagNames.length || pending
                    ? (
                        <TagList
                            disabled={disabled}
                            showEmpty={!pending}
                            tagNames={allTagNames}
                            activeTagNames={activeTagNames}
                            onTagActiveChange={toggleTagActive}
                        />
                    )
                    : <FullSizeWarn icon={<IoFileTrayOutline />} description="还没有任何标签" />
            }
        </Layout>
    );
}
