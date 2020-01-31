import {FC, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {toggleTagList} from '../../actions/panel';
import {addTagToArchive, removeTagFromArchive} from '../../actions/tag';
import useKeyboard from '../../hooks/keyboard';
import {useIsReading} from '../../hooks/state';
import {State} from '../../store';
import TagList from '../TagList';

const ArchiveTagList: FC = () => {
    const isReading = useIsReading();
    const visible = useSelector((s: State) => s.view.isTagVisible);
    const archive = useSelector((s: State) => s.archive);
    const dispatch = useDispatch();
    const toggleTagPanel = useCallback(
        () => {
            if (isReading) {
                dispatch(toggleTagList());
            }
        },
        [dispatch, isReading]
    );
    useKeyboard('T', toggleTagPanel);
    const addTag = useCallback(
        name => dispatch(addTagToArchive(archive.name, name)),
        [archive.name, dispatch]
    );
    const removeTag = useCallback(
        name => dispatch(removeTagFromArchive(archive.name, name)),
        [archive.name, dispatch]
    );

    if (!isReading) {
        return null;
    }

    return (
        <TagList
            newTag
            showTagWithCount={false}
            visible={visible}
            selected={archive.tags}
            onSelect={addTag}
            onUnselect={removeTag}
        />
    );
};

export default ArchiveTagList;
