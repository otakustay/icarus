import {Component} from 'react';
import TagList from './TagList';
import {set, push, remove} from 'san-update/fp';

export default class Filter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tags: props.tags
        };
    }

    onAddTag(tag) {
        this.setState(push('tags', tag));
    }

    onRemoveTag(tag) {
        this.setState(remove('tags', tag));
    }

    onConfirm() {
        this.props.onConfirm(this.state.tags);
    }

    onClear() {
        let empty = [];
        this.setState(set('tags', empty));
        this.props.onConfirm(empty);
    }

    componentWillReceiveProps(props) {
        if (props.tags !== this.props.tags) {
            this.setState(set('tags', props.tags));
        }
    }

    render() {
        /* eslint-disable max-len */
        return (
            <div className="filter" style={{display: this.props.visible ? '' : 'none'}}>
                <div className="filter-content">
                    <h2 className="filter-header">筛选标签</h2>
                    <div className="filter-body">
                        <TagList
                            allTags={this.props.allTags}
                            collisions={{}}
                            tags={this.state.tags}
                            showTagWithCount={true}
                            newTag={false}
                            onAddTag={::this.onAddTag}
                            onRemoveTag={::this.onRemoveTag}
                        />
                    </div>
                </div>
                <footer className="filter-footer">
                    <span className="filter-button" onClick={::this.onConfirm}>筛选</span>
                    <span className="filter-button" onClick={::this.props.onCancel}>取消</span>
                    <span className="filter-button" onClick={::this.onClear}>清空</span>
                </footer>
            </div>
        );
        /* eslint-enable max-len */
    }
}
