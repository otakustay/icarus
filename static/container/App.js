import {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {identity, flow} from 'lodash';
import {connect} from 'react-redux';
import * as action from '../action';

import {
    DropZone,
    Image,
    KeyboardShortcut,
    Key,
    FullscreenToggle,
    Clock,
    Info,
    TagList,
    Alert,
    Loading,
    DisturbMode
} from '../component';

class App extends Component {

    reportSizeChange() {
        let container = findDOMNode(this);
        let size = {
            width: container.offsetWidth,
            height: container.offsetHeight
        };
        this.props.onContainerSizeChange(size);
    }

    componentDidMount() {
        this.reportSizeChange();

        window.addEventListener('resize', ::this.reportSizeChange, false);
    }

    render() {
        let {
            image,
            layout,
            archive,
            message,
            isHelpVisible,
            isFullscreen,
            isLoading,
            isDisturbing,
            timingBegin,
            isInfoVisible,
            isTagVisible
        } = this.props;

        return (
            <div style={{width: '100%', height: '100%'}}>
                <DropZone visible={!image.uri} onOpen={this.props.onOpen} onOpenMultiple={this.props.onOpenMultiple} />
                <Image image={image} layout={layout} />
                <Clock isTiming={!!timingBegin} />
                <Info visible={!isFullscreen || isInfoVisible} archiveName={archive.name} imageName={image.name} />
                <TagList
                    allTags={archive.allTags}
                    tags={archive.tags}
                    visible={isTagVisible}
                    onAddTag={this.props.onAddTag}
                    onRemoveTag={this.props.onRemoveTag}
                />
                <KeyboardShortcut visible={isHelpVisible}>
                    <Key char="F" description="全屏/退出全屏" onTrigger={this.props.onToggleFullscreen} />
                    <Key char=" " description="打开/关闭打扰模式" onTrigger={this.props.onToggleDisturbMode} />

                    <Key char="J" description="往后阅读" onTrigger={this.props.onNextStep} />
                    <Key char="S" description="往后阅读" onTrigger={this.props.onNextStep} />

                    <Key char="K" description="往前阅读" onTrigger={this.props.onPreviousStep} />
                    <Key char="W" description="往前阅读" onTrigger={this.props.onPreviousStep} />

                    <Key char="L" description="下一页" onTrigger={this.props.onNextImage} />
                    <Key char="D" description="下一页" onTrigger={this.props.onNextImage} />

                    <Key char="H" description="上一页" onTrigger={this.props.onPreviousImage} />
                    <Key char="A" description="上一页" onTrigger={this.props.onPreviousImage} />

                    <Key char="N" description="下一部漫画" onTrigger={this.props.onNextArchive} />
                    <Key char="E" description="下一部漫画" onTrigger={this.props.onNextArchive} />

                    <Key char="P" description="上一部漫画" onTrigger={this.props.onPreviousArchive} />
                    <Key char="Q" description="上一部漫画" onTrigger={this.props.onPreviousArchive} />

                    <Key char="R" description="恢复上次阅读图片" onTrigger={this.props.onRestoreState} />

                    <Key char="C" description="开启/关闭计时" onTrigger={this.props.onToggleTiming} />

                    <Key char="1" description="切换至两步布局" onTrigger={() => this.props.onChangeLayout('topBottom')} />
                    <Key char="2" description="切换至单页布局" onTrigger={() => this.props.onChangeLayout('oneStep')} />

                    <Key char="I" description="显示/隐藏文件名（全屏状态有效）" onTrigger={this.props.onToggleInfo} />
                    <Key char="T" description="显示/隐藏漫画标签" onTrigger={this.props.onToggleTagList} />

                    <Key char="¿" description="显示/隐藏帮助" onTrigger={this.props.onToggleHelp} />
                </KeyboardShortcut>
                <FullscreenToggle isFullscreen={isFullscreen} />
                <Alert visible={message.show} content={message.content} />
                <Loading visible={isLoading} />
                <DisturbMode visible={isDisturbing} />
            </div>
        );
    }
}

let mapDispatchToProps = dispatch => Object.entries(action).reduce(
    (handlers, [key, actionCreator]) => {
        let methodName = 'on' + key[0].toUpperCase() + key.substring(1);
        let method = flow(actionCreator, dispatch);
        return {...handlers, [methodName]: method};
    },
    {}
);

export default connect(identity, mapDispatchToProps)(App);
