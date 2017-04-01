import {identity, flow, property} from 'lodash';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {createSelector} from 'reselect';
import * as action from '../action';
import {isReading} from '../selector';

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

let isInfoVisible = createSelector(
    [property('isFullscreen'), property('isInfoVisible')],
    (isFullscreen, isInfoVisible) => !isFullscreen || isInfoVisible
);

export let getViewStates = createSelector(
    [property('isFullscreen'), property('isTagVisible'), isInfoVisible],
    (fullscreen, tag, info) => ({fullscreen, tag, info})
);


let App = props => {
    let {image, layout, archive, message, isHelpVisible, isLoading, isDisturbing, timingBegin, tagCollisions} = props;
    let viewStates = getViewStates(props);

    return (
        <div id="main" style={{width: '100%', height: '100%'}} data-view-state={classNames(viewStates)}>
            <DropZone visible={!isReading(props)} onOpen={props.onOpen} onOpenMultiple={props.onOpenMultiple} />
            <Image image={image} layout={layout} onSizeChange={props.onContainerSizeChange} />
            <Clock isTiming={!!timingBegin} />
            <Info visible={viewStates.info} archiveName={archive.name} imageName={image.name} />
            <TagList
                allTags={archive.allTags}
                tags={archive.tags}
                collisions={tagCollisions}
                visible={viewStates.tag}
                onAddTag={props.onAddTag}
                onRemoveTag={props.onRemoveTag}
            />
            <KeyboardShortcut visible={isHelpVisible}>
                <Key char="F" description="全屏/退出全屏" onTrigger={props.onToggleFullscreen} />
                <Key char=" " description="打开/关闭打扰模式" onTrigger={props.onToggleDisturbMode} />

                <Key char="J" description="往后阅读" onTrigger={props.onNextStep} />
                <Key char="S" description="往后阅读" onTrigger={props.onNextStep} />

                <Key char="K" description="往前阅读" onTrigger={props.onPreviousStep} />
                <Key char="W" description="往前阅读" onTrigger={props.onPreviousStep} />

                <Key char="L" description="下一页" onTrigger={props.onNextImage} />
                <Key char="D" description="下一页" onTrigger={props.onNextImage} />

                <Key char="H" description="上一页" onTrigger={props.onPreviousImage} />
                <Key char="A" description="上一页" onTrigger={props.onPreviousImage} />

                <Key char="N" description="下一部漫画" onTrigger={props.onNextArchive} />
                <Key char="E" description="下一部漫画" onTrigger={props.onNextArchive} />

                <Key char="P" description="上一部漫画" onTrigger={props.onPreviousArchive} />
                <Key char="Q" description="上一部漫画" onTrigger={props.onPreviousArchive} />

                <Key char="R" description="恢复上次阅读图片" onTrigger={props.onRestoreState} />

                <Key char="C" description="开启/关闭计时" onTrigger={props.onToggleTiming} />

                <Key char="1" description="切换至两步布局" onTrigger={() => props.onChangeLayout('topBottom')} />
                <Key char="2" description="切换至单页布局" onTrigger={() => props.onChangeLayout('oneStep')} />

                <Key char="I" description="显示/隐藏文件名（全屏状态有效）" onTrigger={props.onToggleInfo} />
                <Key char="T" description="显示/隐藏漫画标签" onTrigger={props.onToggleTagList} />

                <Key char="¿" description="显示/隐藏帮助" onTrigger={props.onToggleHelp} />
            </KeyboardShortcut>
            <FullscreenToggle isFullscreen={viewStates.fullscreen} />
            <Alert visible={message.show} content={message.content} />
            <Loading visible={isLoading} />
            <DisturbMode visible={isDisturbing} />
        </div>
    );
};

let mapDispatchToProps = dispatch => Object.entries(action).reduce(
    (handlers, [key, actionCreator]) => {
        let methodName = 'on' + key[0].toUpperCase() + key.substring(1);
        let method = flow(actionCreator, dispatch);
        return {...handlers, [methodName]: method};
    },
    {}
);

export default connect(identity, mapDispatchToProps)(App);
