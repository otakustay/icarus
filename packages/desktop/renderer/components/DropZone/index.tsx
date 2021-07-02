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
    border: 6px dashed #4b545d;
    background-color: #212529;
    border-radius: 12px;
    width: 60%;
    height: 60%;
`;

const Hint = styled(FlexCenter)<HighlightProps>`
    padding: 20px 40px;
    font-size: 24px;
    gap: 12px;
    background-color:#15191c;
    border-radius: 12px;
    color: ${({highlight}) => (highlight ? '#fff' : '#ddd')};
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
