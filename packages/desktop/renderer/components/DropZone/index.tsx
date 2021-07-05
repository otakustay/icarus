import styled from 'styled-components';
import {IoBookOutline} from 'react-icons/io5';
import FlexCenter from '@/components/FlexCenter';

const Layout = styled(FlexCenter)`
    width: 100%;
    height: 100%;
`;

interface HighlightProps {
    highlight: boolean;
}

const CenterArea = styled(FlexCenter)`
    border: 6px dashed var(--color-secondary-background);
    background-color: var(--color-panel-background);
    border-radius: 20px;
    width: 60%;
    height: 60%;
`;

const Hint = styled(FlexCenter)<HighlightProps>`
    padding: 20px 40px;
    font-size: 24px;
    gap: 12px;
    background-color:var(--color-primary-background-active);
    border-radius: 12px;
    color: ${({highlight}) => (highlight ? 'var(--color-panel-text-secondary)' : 'var(--color-panel-text-hover)')};
`;

interface Props {
    isDraggingOver: boolean;
}

export default function DropZone({isDraggingOver}: Props) {

    return (
        <Layout>
            <CenterArea>
                <Hint highlight={isDraggingOver}>
                    <IoBookOutline />
                    拖动目录或文件至此
                </Hint>
            </CenterArea>
        </Layout>
    );
}
