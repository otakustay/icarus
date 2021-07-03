import {useCallback, useState, MouseEvent} from 'react';
import styled from 'styled-components';
import {IoCaretDownOutline} from 'react-icons/io5';
import BookSelect from '@/components/BookSelect';
import {useSetReadingContent} from '@/components/ReadingContextProvider';
import {useRemote} from '@/components/RemoteContextProvider';
import AutoJustOverlay from './AutoJustOverlay';

const TriggerIcon = styled(IoCaretDownOutline)`
    font-size: 20px;
    cursor: pointer;

    &:hover {
        color: #fff;
    }
`;

interface Props {
    visible: boolean;
}

export default function BookSelectTrigger({visible}: Props) {
    const [overlayLeft, setOverlayLeft] = useState<number | null>(null);
    const toggleOverlay = useCallback(
        (e: MouseEvent<SVGElement>) => {
            if (overlayLeft === null) {
                const target = e.target as SVGElement;
                const clientRect = target.getBoundingClientRect();
                setOverlayLeft(clientRect.left + clientRect.width / 2);
            }
            else {
                setOverlayLeft(null);
            }
        },
        [overlayLeft]
    );
    const setReadingContent = useSetReadingContent();
    const {navigate: ipc} = useRemote();
    const moveToBook = useCallback(
        async (bookIndex: number) => {
            const content = await ipc.moveCursor({bookIndex, imageIndex: 0});
            setReadingContent(content);
            setOverlayLeft(null);
        },
        [ipc, setReadingContent]
    );

    return (
        <>
            <TriggerIcon onClick={toggleOverlay} />
            {
                visible && overlayLeft !== null && (
                    <AutoJustOverlay left={overlayLeft}>
                        <BookSelect onSelect={moveToBook} />
                    </AutoJustOverlay>
                )
            }
        </>
    );
}
