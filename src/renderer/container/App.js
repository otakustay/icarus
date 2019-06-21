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
    DisturbMode,
    Filter,
} from '../component';

const isInfoVisible = createSelector(
    [isReading, property('isFullscreen'), property('isInfoVisible')],
    (isReading, isFullscreen, isInfoVisible) => isReading && (!isFullscreen || isInfoVisible)
);

export const getViewStates = createSelector(
    [property('isFullscreen'), property('isTagVisible'), isInfoVisible],
    (fullscreen, tag, info) => ({fullscreen, tag, info})
);


const App = props => {
    const {
        image,
        layout,
        tags,
        filter,
        archive,
        message,
        isFilterVisible,
        isHelpVisible,
        isLoading,
        isDisturbing,
        timingBegin,
    } = props;
    const viewStates = getViewStates(props);

    return (
        <div id="main" style={{width: '100%', height: '100%'}} data-view-state={classNames(viewStates)}>
            <DropZone visible={!isReading(props)} onOpen={props.onOpen} onOpenMultiple={props.onOpenMultiple} />
            <Image image={image} layout={layout} onSizeChange={props.onContainerSizeChange} />
            <Clock isTiming={!!timingBegin} />
            <Info visible={viewStates.info} archive={archive} imageName={image.name} />
            <TagList
                allTags={tags.all}
                collisions={tags.collisions}
                tags={archive.tags}
                visible={viewStates.tag}
                onAddTag={props.onAddTag}
                onRemoveTag={props.onRemoveTag}
            />
            <Filter
                visible={isFilterVisible}
                allTags={tags.all}
                tags={filter.tags}
                onConfirm={props.onConfirmFilter}
                onCancel={props.onToggleFilter}
            />
            <KeyboardShortcut visible={isHelpVisible}>
                <Key pattern="F" description="全屏/退出全屏" onTrigger={props.onToggleFullscreen} />
                <Key pattern=" " description="打开/关闭打扰模式" onTrigger={props.onToggleDisturbMode} />

                <Key pattern="J" description="往后阅读" onTrigger={props.onNextStep} />
                <Key pattern="S" description="往后阅读" onTrigger={props.onNextStep} />

                <Key pattern="K" description="往前阅读" onTrigger={props.onPreviousStep} />
                <Key pattern="W" description="往前阅读" onTrigger={props.onPreviousStep} />

                <Key pattern="L" description="下一页" onTrigger={props.onNextImage} />
                <Key pattern="D" description="下一页" onTrigger={props.onNextImage} />

                <Key pattern="H" description="上一页" onTrigger={props.onPreviousImage} />
                <Key pattern="A" description="上一页" onTrigger={props.onPreviousImage} />

                <Key pattern="N" description="下一部漫画" onTrigger={props.onNextArchive} />
                <Key pattern="E" description="下一部漫画" onTrigger={props.onNextArchive} />

                <Key pattern="P" description="上一部漫画" onTrigger={props.onPreviousArchive} />
                <Key pattern="Q" description="上一部漫画" onTrigger={props.onPreviousArchive} />

                <Key pattern="R" description="恢复上次阅读图片" onTrigger={props.onRestoreState} />

                <Key pattern="ALT+F" description="打开标签筛选" onTrigger={props.onToggleFilter} />

                <Key pattern="C" description="开启/关闭计时" onTrigger={props.onToggleTiming} />

                <Key pattern="1" description="切换至两步布局" onTrigger={props.onTopBottomLayout} />
                <Key pattern="2" description="切换至单页布局" onTrigger={props.onOneStepLayout} />

                <Key pattern="I" description="显示/隐藏文件名（全屏状态有效）" onTrigger={props.onToggleInfo} />
                <Key pattern="T" description="显示/隐藏漫画标签" onTrigger={props.onToggleTagList} />

                <Key pattern="¿" description="显示/隐藏帮助" onTrigger={props.onToggleHelp} />
            </KeyboardShortcut>
            <FullscreenToggle isFullscreen={viewStates.fullscreen} />
            <Alert visible={message.show} content={message.content} />
            <Loading visible={isLoading} />
            <DisturbMode visible={isDisturbing} />
        </div>
    );
};

const mapDispatchToProps = dispatch => Object.entries(action).reduce(
    (handlers, [key, actionCreator]) => {
        const methodName = 'on' + key[0].toUpperCase() + key.substring(1);
        const method = flow(actionCreator, dispatch);
        return {...handlers, [methodName]: method};
    },
    {}
);

export default connect(identity, mapDispatchToProps)(App);
