import {useKeyboard} from '../../hooks';

export default ({pattern, onTrigger}) => {
    useKeyboard(pattern, onTrigger);

    return null;
};
