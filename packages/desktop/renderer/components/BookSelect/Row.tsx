import {useRef, useCallback} from 'react';
import styled from 'styled-components';
import {useScrollIntoView} from '@huse/scroll-into-view';

const ActiveSign = styled.i`
    display: inline-block;
    width: 8px;
    height: 8px;
    text-align: center;
    justify-self: center;
    border-radius: 50%;
    background-color: #abc600;
`;

const RelativeSign = styled.span`
    visibility: hidden;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const BookName = styled.span`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const Layout = styled.li`
    display: grid;
    grid-template-columns: 32px 1fr;
    grid-auto-flow: column;
    grid-column-gap: 4px;
    padding: 4px;
    align-items: center;
    font-size: 12px;
    cursor: pointer;

    &:hover {
        color: #fff;

        ${RelativeSign} {
            visibility: initial;
        }
    }
`;

const formatRelativeIndex = (index: number) => (index > 0 ? `+${index}` : index.toString());

interface Props {
    bookName: string;
    bookIndex: number;
    relativeIndex: number;
    onSelect: (bookIndex: number) => void;
}

export default function BookSelectRow({bookName, bookIndex, relativeIndex, onSelect}: Props) {
    const ref = useRef<HTMLLIElement>(null);
    useScrollIntoView(ref, !relativeIndex, {block: 'center'});
    const select = useCallback(
        () => onSelect(bookIndex),
        [bookIndex, onSelect]
    );

    return (
        <Layout ref={ref} onClick={select}>
            {relativeIndex ? <RelativeSign>{formatRelativeIndex(relativeIndex)}</RelativeSign> : <ActiveSign />}
            <BookName>{bookName}</BookName>
        </Layout>
    );
}
