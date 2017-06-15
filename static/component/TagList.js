import {PureComponent} from 'react';
import pinyin from 'pinyin';
import {createSelector} from 'reselect';
import {property, propertyOf, compact, max} from 'lodash';
import {autobind} from 'core-decorators';

let getCategory = tag => pinyin(tag, {style: pinyin.STYLE_NORMAL})[0][0][0].toUpperCase();

let categorize = createSelector(
    [property('allTags'), property('tags'), property('collisions')],
    (all, selected, collisions) => {
        let selectedSet = new Set(selected);
        let collisionTable = selected.map(propertyOf(collisions));
        let result = all.reduce(
            (result, tag) => {
                let category = getCategory(tag.name);
                let collisionRate = max(compact(collisionTable.map(property(tag.name))));
                if (collisionRate) {
                    collisionRate = Math.min(Math.round(collisionRate * 10), 9);
                }
                let cache = result[category] || (result[category] = []);
                cache.push({...tag, selected: selectedSet.has(tag.name), collisionRate: collisionRate});
                return result;
            },
            {}
        );
        return Object.keys(result).sort().map(category => ({key: category, tags: result[category]}));
    }
);

export default class TagList extends PureComponent {

    static defaultProps = {
        visible: true,
        showTagWithCount: false,
        newTag: true
    };

    state = {
        newTagName: ''
    };

    @autobind
    onChange(e) {
        let value = e.target.value;
        this.setState(() => ({newTagName: value}));
    }

    @autobind
    onTagEnter(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        if (e.which !== 13) {
            return;
        }

        this.props.onAddTag(this.state.newTagName.trim());

        this.setState(() => ({newTagName: ''}));
    }

    onClickTag(tagName, selected) {
        if (selected) {
            this.props.onRemoveTag(tagName);
        }
        else {
            this.props.onAddTag(tagName);
        }
    }

    render() {
        let tagCategories = categorize(this.props);

        let item = ({name, count, selected, collisionRate}) => {
            let className = selected ? 'tag-item tag-item-selected' : 'tag-item';
            if (collisionRate) {
                className += ` tag-collision-${collisionRate}`;
            }
            let text = this.props.showTagWithCount ? `${name} (${count})` : name;

            /* eslint-disable react/jsx-no-bind */
            return <li key={name} className={className} onClick={() => this.onClickTag(name, selected)}>{text}</li>;
            /* eslint-enable react/jsx-no-bind */
        };

        let category = ({key, tags}) => (
            <div key={key} className="tag-category">
                <h3 className="tag-category-key">{key.toUpperCase()}</h3>
                <ul className="tag-item-list">
                    {tags.map(item)}
                </ul>
            </div>
        );

        return (
            <div className="tag" style={{display: this.props.visible ? '' : 'none'}}>
                <input
                    className="new-tag"
                    placeholder="输入标签"
                    value={this.state.newTagName}
                    style={{display: this.props.newTag ? '' : 'none'}}
                    onChange={this.onChange}
                    onKeyUp={this.onTagEnter}
                />
                {tagCategories.map(category)}
            </div>
        );
    }
}
