/**
 * @file 键盘快捷键初始化入口
 * @author otakustay
 */

'use strict';

/**
 * 初始化快捷键
 *
 * @param {static.BrowsingContext} browsingContext 前端上下文
 */
module.exports = browsingContext => {
    const EXCLUSIVE = {exclusive: true};
    let surface = browsingContext.surface;

    surface.registerKeyboardShortcut('F', '全屏/退出全屏', require('../command/fullscreen'), EXCLUSIVE);

    surface.registerKeyboardShortcut('N', '下一部漫画', require('../command/nextArchive'), EXCLUSIVE);
    surface.registerKeyboardShortcut('E', '下一部漫画', require('../command/nextArchive'), EXCLUSIVE);

    surface.registerKeyboardShortcut('P', '上一部漫画', require('../command/previousArchive'), EXCLUSIVE);
    surface.registerKeyboardShortcut('Q', '上一部漫画', require('../command/previousArchive'), EXCLUSIVE);

    surface.registerKeyboardShortcut('J', '往后阅读', require('../command/nextStep'), EXCLUSIVE);
    surface.registerKeyboardShortcut('S', '往后阅读', require('../command/nextStep'), EXCLUSIVE);

    surface.registerKeyboardShortcut('K', '往前阅读', require('../command/previousStep'), EXCLUSIVE);
    surface.registerKeyboardShortcut('W', '往前阅读', require('../command/previousStep'), EXCLUSIVE);

    surface.registerKeyboardShortcut('L', '下一页', require('../command/nextImage'), EXCLUSIVE);
    surface.registerKeyboardShortcut('D', '下一页', require('../command/nextImage'), EXCLUSIVE);

    surface.registerKeyboardShortcut('H', '上一页', require('../command/previousImage'), EXCLUSIVE);
    surface.registerKeyboardShortcut('A', '上一页', require('../command/previousImage'), EXCLUSIVE);

    surface.registerKeyboardShortcut('R', '恢复上次阅读图片', () => browsingContext.restore(), EXCLUSIVE);

    surface.registerKeyboardShortcut('I', '显示/隐藏文件名', () => surface.invokeWidget('info', 'toggle'));

    surface.registerKeyboardShortcut('¿', '显示/隐藏帮助', () => surface.invokeWidget('help', 'toggle'));

    surface.registerKeyboardShortcut(' ', '打开/关闭打扰模式', () => surface.invokeWidget('disturb', 'toggle'));
};
