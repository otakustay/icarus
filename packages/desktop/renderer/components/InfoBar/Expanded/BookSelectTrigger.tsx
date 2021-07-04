import {IoListOutline} from 'react-icons/io5';
import {useToggleBookList} from '@/components/ReadingLayoutContextProvider';
import IconTrigger from './IconTrigger';

export default function BookSelectTrigger() {
    const toggleBookList = useToggleBookList();

    return <IconTrigger icon={<IoListOutline />} onClick={toggleBookList} />;
}
