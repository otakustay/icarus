import {IoHelpCircleOutline} from 'react-icons/io5';
import {useToggleHelp} from '@/components/ReadingLayoutContextProvider';
import IconTrigger from './IconTrigger';

export default function BookSelectTrigger() {
    const toggleHelp = useToggleHelp();

    return <IconTrigger icon={<IoHelpCircleOutline />} onClick={toggleHelp} />;
}
