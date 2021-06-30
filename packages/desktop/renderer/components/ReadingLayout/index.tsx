import {useReadingBook, useReadingImage} from '@/components/ReadingContextProvider';

export default function ReadingLayout() {
    const book = useReadingBook();
    const image = useReadingImage();

    return (
        <pre style={{color: '#fff', padding: 40}}>
            {JSON.stringify({book, image}, null, '    ')}
        </pre>
    );
}
