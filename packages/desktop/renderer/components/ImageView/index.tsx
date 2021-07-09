import styled from '@emotion/styled';
import {IoImageOutline} from 'react-icons/io5';
import {Direction} from '@icarus/shared';
import {useElementSize} from '@huse/element-size';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {KEY_NEXT_IMAGE, KEY_NEXT_STEP, KEY_PREVIOUS_IMAGE, KEY_PREVIOUS_STEP} from '@/dicts/keyboard';
import {useLayoutType, useReadingBook, useReadingImageUnsafe} from '@/components/ReadingContextProvider';
import FullSizeWarn from '@/components/FullSizeWarn';
import Content from './Content';

const Container = styled.div`
    height: 100%;
    overflow: hidden;
`;

interface Props {
    onNavigate: (direction: Direction) => void;
}

function ImageBroken({onNavigate}: Props) {
    useGlobalShortcut(KEY_NEXT_STEP, () => onNavigate('forward'));
    useGlobalShortcut(KEY_PREVIOUS_STEP, () => onNavigate('backward'));

    return <FullSizeWarn size={100} icon={<IoImageOutline />} description="当前图片已损坏" />;
}

export default function ImageView({onNavigate}: Props) {
    const book = useReadingBook();
    const image = useReadingImageUnsafe();
    const layoutType = useLayoutType();
    const [containerRef, containerSize] = useElementSize();
    useGlobalShortcut(KEY_NEXT_IMAGE, () => onNavigate('forward'));
    useGlobalShortcut(KEY_PREVIOUS_IMAGE, () => onNavigate('backward'));

    if (!image) {
        return <ImageBroken onNavigate={onNavigate} />;
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
