import styled from 'styled-components';
import {IoImageOutline} from 'react-icons/io5';
import {Direction} from '@icarus/shared';
import {useElementSize} from '@huse/element-size';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {KEY_NEXT_IMAGE, KEY_PREVIOUS_IMAGE} from '@/dicts/keyboard';
import {useLayoutType, useReadingBook, useReadingImageUnsafe} from '@/components/ReadingContextProvider';
import FullSizeWarn from '@/components/FullSizeWarn';
import Content from './Content';

const Container = styled.div`
    flex: 1;
    height: 100%;
    overflow: hidden;
`;

interface Props {
    onNavigate: (direction: Direction) => void;
}

export default function ImageView({onNavigate}: Props) {
    const book = useReadingBook();
    const image = useReadingImageUnsafe();
    const layoutType = useLayoutType();
    const [containerRef, containerSize] = useElementSize();
    useGlobalShortcut(KEY_NEXT_IMAGE, () => onNavigate('forward'));
    useGlobalShortcut(KEY_PREVIOUS_IMAGE, () => onNavigate('backward'));

    if (!image) {
        // TODO: 图片损坏时把前一下、下一步注册到图片移动上去
        return <FullSizeWarn size={100} icon={<IoImageOutline />} description="当前图片已损坏" />;
    }

    return (
        <Container ref={containerRef}>
            {
                containerSize && image.name && (
                    <Content
                        key={`${book.name}/${image.name}:${layoutType}`}
                        layoutType={layoutType}
                        content={image.content}
                        width={image.width}
                        height={image.height}
                        containerWidth={containerSize.width}
                        containerHeight={containerSize.height}
                        onNavigateOut={onNavigate}
                    />
                )
            }
        </Container>
    );
}
