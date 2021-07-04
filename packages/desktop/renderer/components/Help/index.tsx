import styled from 'styled-components';
import * as K from '@/dicts/keyboard';
import ShortcutRow from './ShortcutRow';

const Title = styled.h3`
    margin: 0 0 12px;
    color: var(--color-panel-text);
`;

const ShortcutDescription = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
`;

export default function Filter() {
    return (
        <>
            <Title>快捷键说明</Title>
            <ShortcutDescription>
                <ShortcutRow
                    description="恢复上次关闭时的阅读进度"
                    tooltip="如果没有前次阅读记录，什么也不会发生"
                    keys={K.KEY_RESTORE}
                />
                <ShortcutRow
                    description="往后一步"
                    tooltip="如果图片分多步查看就移动图片，也有可能转到下一页、下一本漫画的第一页"
                    keys={K.KEY_NEXT_STEP}
                />
                <ShortcutRow
                    description="往前一步"
                    tooltip="如果图片分多步查看就移动图片，也有可能转到上一页、上一本漫画的最后一页"
                    keys={K.KEY_PREVIOUS_STEP}
                />
                <ShortcutRow description="查看下一张图片" tooltip="可能转到下一本漫画的第一页" keys={K.KEY_NEXT_IMAGE} />
                <ShortcutRow
                    description="查看上一张图片"
                    tooltip="可能转到上一本漫画的最后一页"
                    keys={K.KEY_PREVIOUS_IMAGE}
                />
                <ShortcutRow description="转到下一本漫画" keys={K.KEY_NEXT_BOOK} />
                <ShortcutRow description="转到上一本漫画" keys={K.KEY_PREVIOUS_BOOK} />
                <ShortcutRow
                    description="打开、收起标签栏"
                    tooltip="在阅读时可以操作，可通过标签栏为当前的漫画增加标签"
                    keys={K.KEY_TOGGLE_TAG_LIST}
                />
                <ShortcutRow
                    description="显示当前计时"
                    tooltip="软件会从第一次打开漫画时开始自动计时，如果当前阅读还不到30秒则不会显示计时"
                    keys={K.KEY_DISPLAY_TIMING}
                />
                <ShortcutRow
                    description="显示漫画筛选器"
                    tooltip="可以选择几个自己感兴趣的标签，并从当前阅读的漫画中筛选出同时包含这些标签的"
                    keys={K.KEY_TOGGLE_FILTER}
                />
                <ShortcutRow description="进入、退出全屏" keys={K.KEY_TOGGLE_FULLSCREEN} />
                <ShortcutRow description="打开、关闭详细信息面板" keys={K.KEY_TOGGLE_INFO} />
                <ShortcutRow description="打开、关闭本子选择界面" keys={K.KEY_TOGGLE_BOOK_LIST} />
                <ShortcutRow description="打开、关闭帮助面板" keys={K.KEY_TOGGLE_HELP} />
            </ShortcutDescription>
            <Title>项目信息</Title>
            <p>GitHub：https://github.com/otakustay/icarus</p>
        </>
    );
}
