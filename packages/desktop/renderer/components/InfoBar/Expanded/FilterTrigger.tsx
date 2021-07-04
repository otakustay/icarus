import {IoFunnelOutline} from 'react-icons/io5';
import {useToggleFilter} from '@/components/ReadingLayoutContextProvider';
import IconTrigger from './IconTrigger';

export default function BookSelectTrigger() {
    const toggleFilter = useToggleFilter();

    return <IconTrigger icon={<IoFunnelOutline />} onClick={toggleFilter} />;
}
