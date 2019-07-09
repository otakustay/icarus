import {useMemo} from 'react';
import {identity, flow, property} from 'lodash';
import {useSelector, useDispatch} from 'react-redux';
import classNames from 'classnames';
import {createSelector} from 'reselect';
import * as actions from '../../actions';
import {isReading} from '../../selectors';
import {useFullscreen} from '../../hooks';
import '../../styles';
import DropZone from '../DropZone';
import Image from '../Image';
import KeyboardShortcut from '../KeyboardShortcut';
import Key from '../Key';
import Clock from '../Clock';
import Info from '../Info';
import TagList from '../TagList';
import Alert from '../Alert';
import Loading from '../Loading';
import DisturbMode from '../DisturbMode';
import Filter from '../Filter';

const isInfoVisible = createSelector(
    [isReading, property('isFullscreen'), property('isInfoVisible')],
    (isReading, isFullscreen, isInfoVisible) => isReading && (!isFullscreen || isInfoVisible)
);

export const getViewStates = createSelector(
    [property('isFullscreen'), property('isTagVisible'), isInfoVisible],
    (fullscreen, tag, info) => ({fullscreen, tag, info})
);

export default () => {
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
        isFullscreen,
        isTagVisible,
        isInfoVisible,
    } = useSelector(identity);
    const viewStates = useMemo(
        () => {
            return {
                fullscreen: isFullscreen,
                tag: isTagVisible,
                info: isInfoVisible,
            };
        },
        [isFullscreen, isTagVisible, isInfoVisible]
    );
    const dispatch = useDispatch();
    const callbacks = useMemo(
        () => Object.entries(actions).reduce(
            (handlers, [key, actionCreator]) => {
                if (typeof actionCreator !== 'function') {
                    return handlers;
                }

                const methodName = 'on' + key[0].toUpperCase() + key.substring(1);
                const method = flow(actionCreator, dispatch);
                return {...handlers, [methodName]: method};
            },
            {}
        ),
        [dispatch]
    );
    useFullscreen(viewStates.fullscreen);

    return (
        <div id="main" style={{width: '100%', height: '100%'}} data-view-state={classNames(viewStates)}>
            <DropZone visible={!image.uri} onOpen={callbacks.onOpen} onOpenMultiple={callbacks.onOpenMultiple} />
            <Image
                image={image}
                layout={layout}
                viewStates={viewStates}
                onSizeChange={callbacks.onContainerSizeChange}
            />
            <Clock isTiming={!!timingBegin} />
            <Info visible={viewStates.info} archive={archive} imageName={image.name} viewStates={viewStates} />
            <TagList
                allTags={tags.all}
                collisions={tags.collisions}
                tags={archive.tags}
                visible={viewStates.tag}
                onAddTag={callbacks.onAddTag}
                onRemoveTag={callbacks.onRemoveTag}
            />
            <Filter
                visible={isFilterVisible}
                allTags={tags.all}
                tags={filter.tags}
                onConfirm={callbacks.onConfirmFilter}
                onCancel={callbacks.onToggleFilter}
            />
            <KeyboardShortcut visible={isHelpVisible}>
                <Key pattern="F" description="全屏/退出全屏" onTrigger={callbacks.onToggleFullscreen} />
                <Key pattern=" " description="打开/关闭打扰模式" onTrigger={callbacks.onToggleDisturbMode} />

                <Key pattern="J" description="往后阅读" onTrigger={callbacks.onNextStep} />
                <Key pattern="S" description="往后阅读" onTrigger={callbacks.onNextStep} />

                <Key pattern="K" description="往前阅读" onTrigger={callbacks.onPreviousStep} />
                <Key pattern="W" description="往前阅读" onTrigger={callbacks.onPreviousStep} />

                <Key pattern="L" description="下一页" onTrigger={callbacks.onNextImage} />
                <Key pattern="D" description="下一页" onTrigger={callbacks.onNextImage} />

                <Key pattern="H" description="上一页" onTrigger={callbacks.onPreviousImage} />
                <Key pattern="A" description="上一页" onTrigger={callbacks.onPreviousImage} />

                <Key pattern="N" description="下一部漫画" onTrigger={callbacks.onNextArchive} />
                <Key pattern="E" description="下一部漫画" onTrigger={callbacks.onNextArchive} />

                <Key pattern="P" description="上一部漫画" onTrigger={callbacks.onPreviousArchive} />
                <Key pattern="Q" description="上一部漫画" onTrigger={callbacks.onPreviousArchive} />

                <Key pattern="R" description="恢复上次阅读图片" onTrigger={callbacks.onRestoreState} />

                <Key pattern="ALT+F" description="打开标签筛选" onTrigger={callbacks.onToggleFilter} />

                <Key pattern="C" description="开启/关闭计时" onTrigger={callbacks.onToggleTiming} />

                <Key pattern="1" description="切换至两步布局" onTrigger={callbacks.onTopBottomLayout} />
                <Key pattern="2" description="切换至单页布局" onTrigger={callbacks.onOneStepLayout} />

                <Key pattern="I" description="显示/隐藏文件名（全屏状态有效）" onTrigger={callbacks.onToggleInfo} />
                <Key pattern="T" description="显示/隐藏漫画标签" onTrigger={callbacks.onToggleTagList} />

                <Key pattern="¿" description="显示/隐藏帮助" onTrigger={callbacks.onToggleHelp} />
            </KeyboardShortcut>
            <Alert visible={message.show} title={message.title} content={message.content} />
            <Loading visible={isLoading} />
            <DisturbMode visible={isDisturbing} />
        </div>
    );
};
