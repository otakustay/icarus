import {useReadingContent} from '@/components/ReadingContextProvider';

export default function ReadingLayout() {
    const readingContent = useReadingContent();

    return (
        <pre style={{color: '#fff'}}>
            {JSON.stringify(readingContent.state, null, '    ')}
        </pre>
    );
}
