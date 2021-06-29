import {useCallback} from 'react';
import styled from 'styled-components';
import {IoBookOutline} from 'react-icons/io5';
import {useDocumentEvent} from '@huse/document-event';
import {useSwitch} from '@huse/boolean';
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
    onOpenDirectory: (location: string) => void;
}

export default function DropZone({onOpenDirectory}: Props) {
    const [accepting, addAccepting, removeAccepting] = useSwitch(false);
    useDocumentEvent('dragover', e => e.preventDefault());
    useDocumentEvent('dragenter', addAccepting);
    useDocumentEvent(
        'dragleave',
        e => {
            if (!e.relatedTarget) {
                removeAccepting();
            }
        }
    );
    const drop = useCallback(
        (e: DragEvent) => {
            e.stopPropagation();
            e.preventDefault();

            if (!e.dataTransfer?.files.length) {
                return;
            }

            const [file] = e.dataTransfer.files;
            onOpenDirectory(file.path);

            removeAccepting();
        },
        [onOpenDirectory, removeAccepting]
    );
    useDocumentEvent('drop', drop);

    return (
        <Layout>
            <CenterArea>
                <Hint highlight={accepting}>
                    <IoBookOutline />
                    拖动目录或文件至此
                </Hint>
            </CenterArea>
        </Layout>
    );
}
