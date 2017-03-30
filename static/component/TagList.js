import {Component} from 'react';
import pinyin from 'pinyin';

let getCategory = tag => pinyin(tag, {style: pinyin.STYLE_NORMAL})[0][0][0].toUpperCase();

let categorize = (all, selected) => {
    let selectedSet = new Set(selected);
    let result = all.reduce(
        (result, tag) => {
            let category = getCategory(tag);
            let cache = result[category] || (result[category] = []);
            cache.push({name: tag, selected: selectedSet.has(tag)});
            return result;
        },
        {}
    );
    return Object.keys(result).sort().map(category => ({key: category, tags: result[category]}));
};

export default class TagList extends Component {

    state = {
        newTagName: ''
    };

    onChange(e) {
        let value = e.target.value;
        this.setState(() => ({newTagName: value}));
    }

    onTagEnter(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        if (e.which !== 13) {
            return;
        }

        this.props.onAddTag(this.state.newTagName.trim());

        this.setState(() => ({newTagName: ''}));
    }

    onClickTag(e) {
        let tagName = e.target.innerText;
        if (e.target.classList.contains('tag-item-selected')) {
            this.props.onRemoveTag(tagName);
        }
        else {
            this.props.onAddTag(tagName);
        }
    }

    render() {
        let {allTags, tags, visible} = this.props;
        let tagCategories = categorize(allTags, tags);

        let item = ({name, selected}) => {
            let className = selected ? 'tag-item tag-item-selected' : 'tag-item';

            return <li key={name} className={className} onClick={::this.onClickTag}>{name}</li>;
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
            <div className="tag" style={{display: visible ? '' : 'none'}}>
                <input
                    className="new-tag"
                    placeholder="输入标签"
                    value={this.state.newTagName}
                    onChange={::this.onChange}
                    onKeyUp={::this.onTagEnter}
                />
                {tagCategories.map(category)}
            </div>
        );
    }
}
