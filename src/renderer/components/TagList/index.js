import {useCallback, useMemo} from 'react';
import pinyin, {STYLE_NORMAL} from 'pinyin';
import {property, propertyOf, compact, max} from 'lodash';
import {useInputValue} from '../../hooks';
import c from './index.less';

// 这个奇葩的库基本上最常用的读音都在最后面
const getCategory = tag => {
    try {
        return pinyin(tag, {heteronym: false, style: STYLE_NORMAL})[0][0][0].toUpperCase();
    }
    catch (ex) {
        return '?';
    }
};

const TagList = ({className, visible, tags, allTags, collisions, newTag, showTagWithCount, onAddTag, onRemoveTag}) => {
    const {value: newTagName, onChange: setNewTagName} = useInputValue('');
    const tagEnter = useCallback(
        e => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();

            if (e.which !== 13) {
                return;
            }

            onAddTag(newTagName.trim());
            setNewTagName('');
        },
        [onAddTag, newTagName, setNewTagName]
    );
    const toggleTag = useCallback(
        (tagName, selected) => {
            if (selected) {
                onRemoveTag(tagName);
            }
            else {
                onAddTag(tagName);
            }
        },
        [onAddTag, onRemoveTag]
    );
    const tagCategories = useMemo(
        () => {
            const selectedSet = new Set(tags);
            const collisionTable = tags.map(propertyOf(collisions));
            const result = allTags.reduce(
                (result, tag) => {
                    const category = getCategory(tag.name);
                    let collisionRate = max(compact(collisionTable.map(property(tag.name))));
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
        [allTags, collisions, tags]
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

    const category = ({key, tags}) => (
        <div key={key}>
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
                style={{display: newTag ? '' : 'none'}}
                onChange={setNewTagName}
                onKeyUp={tagEnter}
            />
            {tagCategories.map(category)}
        </div>
    );
};

TagList.defaultProps = {
    visible: true,
    showTagWithCount: false,
    newTag: true,
};

export default TagList;
