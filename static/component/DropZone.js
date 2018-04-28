import {PureComponent} from 'react';
import {macro} from 'san-update';
import classNames from 'classnames';
import {noop} from 'lodash';
import {bind} from 'lodash-decorators';
import GlobalEvent from './GlobalEvent';

const addAccepting = macro().set('accepting', true).build();
const removeAccepting = macro().set('accepting', false).build();

export default class DropZone extends PureComponent {

    defaultProps = {
        visible: true,
        onOpen: noop,
        onOpenMultiple: noop
    };

    state = {
        accepting: false
    };

    @bind()
    onDragOver(e) {
        e.preventDefault();
    }

    @bind()
    onDragEnter() {
        this.setState(addAccepting);
    }

    @bind()
    onDragLeave() {
        this.setState(removeAccepting);
    }

    @bind()
    onDrop(e) {
        e.stopPropagation();
        e.preventDefault();

        if (!e.dataTransfer.files.length) {
            return;
        }

        // 只拖动一个目录或压缩文件，则浏览该目录下的所有压缩文件
        if (e.dataTransfer.files.length === 1) {
            const file = e.dataTransfer.files[0];
            if (!file.type || file.type.includes('zip')) {
                this.props.onOpen(file.path);
            }
        }
        // 如果是多个压缩文件，则只浏览选中的这些。不支持多个目录
        else {
            const files = Array.from(e.dataTransfer.files)
                .filter(file => file.type.includes('zip'))
                .map(file => file.path);
            if (files.length) {
                this.props.onOpenMultiple(files);
            }
        }

        this.setState(removeAccepting);
    }

    render() {
        const classes = {
            'drop-indicator': true,
            'accepting': this.state.accepting
        };

        return (
            <div className={classNames(classes)} style={{display: this.props.visible ? '' : 'none'}}>
                将目录或.zip文件拖到此处
                <GlobalEvent
                    onDragOver={this.onDragOver}
                    onDragEnter={this.onDragEnter}
                    onDragLeave={this.onDragLeave}
                    onDrop={this.onDrop}
                />
            </div>
        );
    }
}
