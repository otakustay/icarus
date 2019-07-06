import {useCallback, useRef, useReducer} from 'react';
import TagList from '../TagList';
import c from './index.less';

const reduceSet = (state, {type, value}) => {
    if (type === 'REPLACE') {
        return value;
    }

    const indexOfItem = state.indexOf(value);
    switch (type) {
        case 'ADD':
            return indexOfItem < 0 ? [...state, value] : state;
        case 'REMOVE':
            return indexOfItem < 0 ? state : [...state.slice(0, indexOfItem), ...state.slice(indexOfItem + 1)];
        default:
            return state;
    }
};

const useDerivedTags = value => {
    const [tags, dispatch] = useReducer(reduceSet, value);
    const previousValue = useRef(value);
    const add = useCallback(
        value => dispatch({value, type: 'ADD'}),
        []
    );
    const remove = useCallback(
        value => dispatch({value, type: 'REMOVE'}),
        []
    );
    const replace = useCallback(
        value => dispatch({value, type: 'REPLACE'}),
        []
    );

    if (previousValue.current !== value) {
        previousValue.current = value;
        replace(value);
    }

    return [tags, add, remove, replace];
};

export default props => {
    const {visible, allTags, onConfirm, onCancel} = props;
    const [tags, addTag, removeTag, replaceTags] = useDerivedTags(props.tags);
    const confirm = useCallback(
        () => onConfirm(tags),
        [tags, onConfirm]
    );
    const clear = useCallback(
        () => {
            const empty = [];
            replaceTags(empty);
            onConfirm(empty);
        },
        [replaceTags, onConfirm]
    );

    return (
        <div className={c.root} style={{display: visible ? '' : 'none'}}>
            <div className={c.content}>
                <h2 className={c.header}>筛选标签</h2>
                <div className={c.body}>
                    <TagList
                        className={c.tag}
                        allTags={allTags}
                        collisions={{}}
                        tags={tags}
                        showTagWithCount
                        newTag={false}
                        onAddTag={addTag}
                        onRemoveTag={removeTag}
                    />
                </div>
            </div>
            <footer className={c.footer}>
                <span className={c.button} onClick={confirm}>筛选</span>
                <span className={c.button} onClick={onCancel}>取消</span>
                <span className={c.button} onClick={clear}>清空</span>
            </footer>
        </div>
    );
};
