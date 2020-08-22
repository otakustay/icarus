import {useCallback, useMemo, useState, FC} from 'react';
import {useSelector} from 'react-redux';
import {compact, max} from 'lodash';
import {getPinYinPrefix} from '../../lib/pinYin';
import {State} from '../../store';
import c from './index.less';

interface Props {
    className?: string;
    visible: boolean;
    newTag: boolean;
    showTagWithCount: boolean;
    selected: string[];
    onSelect(tag: string): void;
    onUnselect(tag: string): void;
}

const TagList: FC<Props> = ({className, visible, selected, newTag, showTagWithCount, onSelect, onUnselect}) => {
    const allTags = useSelector((s: State) => s.tags.all);
    const collisions = useSelector((s: State) => s.tags.collisions);
    const [newTagName, setNewTagName] = useState('');
    const inputNewTagName = useCallback(
        e => setNewTagName(e.target.value),
        []
    );
    const tagEnter = useCallback(
        e => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();

            if (e.which !== 13) {
                return;
            }

            onSelect(newTagName.trim());
            setNewTagName('');
        },
        [onSelect, newTagName]
    );
    const toggleTag = useCallback(
        (tagName, selected) => {
            if (selected) {
                onUnselect(tagName);
            }
            else {
                onSelect(tagName);
            }
        },
        [onSelect, onUnselect]
    );
    const tagCategories = useMemo(
        () => {
            const selectedSet = new Set(selected);
            const collisionTable = selected.map(t => collisions[t]);
            const result = allTags.reduce(
                (result, tag) => {
                    const category = getPinYinPrefix(tag.name)?.toUpperCase() ?? '?';
                    let collisionRate = max(compact(collisionTable.map(t => t?.[tag.name]))) || 0;
                    if (collisionRate) {
                        collisionRate = Math.min(Math.round(collisionRate * 10), 9);
                    }
                    const cache = result[category] || [];
                    cache.push({...tag, selected: selectedSet.has(tag.name), collisionRate: collisionRate});
                    return {
                        ...result,
                        [category]: cache,
                    };
                },
                {}
            );
            return Object.keys(result).sort().map(category => ({key: category, tags: result[category]}));
        },
        [allTags, collisions, selected]
    );

    const item = ({name, count, selected, collisionRate}) => {
        const className = c(
            'item',
            {'item-selected': selected},
            collisionRate ? `collision-${collisionRate}` : null
        );
        const text = showTagWithCount ? `${name} (${count})` : name;

        /* eslint-disable react/jsx-no-bind */
        return <li key={name} className={className} onClick={() => toggleTag(name, selected)}>{text}</li>;
        /* eslint-enable react/jsx-no-bind */
    };

    const renderCategory = ({key, tags}) => (
        <div key={key} className={c.category}>
            <h3 className={c.categoryKey}>{key.toUpperCase()}</h3>
            <ul className={c.itemList}>
                {tags.map(item)}
            </ul>
        </div>
    );

    return (
        <div className={c('root', className)} style={{display: visible ? '' : 'none'}}>
            <input
                className={c.newTag}
                placeholder="输入标签"
                value={newTagName}
                onChange={inputNewTagName}
                style={{display: newTag ? '' : 'none'}}
                onKeyUp={tagEnter}
            />
            {tagCategories.map(renderCategory)}
        </div>
    );
};

export default TagList;
