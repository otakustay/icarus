import {PureComponent} from 'react';
import {macro} from 'san-update';
import classNames from 'classnames';
import GlobalEvent from './GlobalEvent';
import {autobind} from 'core-decorators';

let addAccepting = macro().set('accepting', true).build();
let removeAccepting = macro().set('accepting', false).build();

export default class DropZone extends PureComponent {

    defaultProps = {
        visible: true,

        onOpen() {},
        onOpenMultiple() {}
    };

    state = {
        accepting: false
    };

    @autobind
    onDragOver(e) {
        e.preventDefault();
    }

    @autobind
    onDragEnter() {
        this.setState(addAccepting);
    }

    @autobind
    onDragLeave() {
        this.setState(removeAccepting);
    }

    @autobind
    onDrop(e) {
        e.stopPropagation();
        e.preventDefault();

        if (!e.dataTransfer.files.length) {
            return;
        }

        // 只拖动一个目录或压缩文件，则浏览该目录下的所有压缩文件
        if (e.dataTransfer.files.length === 1) {
            let file = e.dataTransfer.files[0];
            if (!file.type || file.type.includes('zip')) {
                this.props.onOpen(file.path);
            }
        }
        // 如果是多个压缩文件，则只浏览选中的这些。不支持多个目录
        else {
            let files = Array.from(e.dataTransfer.files)
                .filter(file => file.type.includes('zip'))
                .map(file => file.path);
            if (files.length) {
                this.props.onOpenMultiple(files);
            }
        }

        this.setState(removeAccepting);
    }

    render() {
        let classes = {
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
