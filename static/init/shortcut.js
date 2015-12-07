/**
 * @file 键盘快捷键初始化入口
 * @author otakustay
 */

'use strict';

/**
 * 初始化快捷键
 *
 * @param {static.Surface} surface 前端界面
 */
module.exports = surface => {
    surface.registerKeyboardShortcut('F', '全屏/退出全屏', require('../command/fullscreen'));

    surface.registerKeyboardShortcut(' ', '打开/关闭打扰模式', () => surface.invokeWidget('disturb', 'toggle'));

    surface.registerKeyboardShortcut('J', '往后阅读', require('../command/nextStep'));
    surface.registerKeyboardShortcut('S', '往后阅读', require('../command/nextStep'));

    surface.registerKeyboardShortcut('K', '往前阅读', require('../command/previousStep'));
    surface.registerKeyboardShortcut('W', '往前阅读', require('../command/previousStep'));

    surface.registerKeyboardShortcut('L', '下一页', require('../command/nextImage'));
    surface.registerKeyboardShortcut('D', '下一页', require('../command/nextImage'));

    surface.registerKeyboardShortcut('H', '上一页', require('../command/previousImage'));
    surface.registerKeyboardShortcut('A', '上一页', require('../command/previousImage'));

    surface.registerKeyboardShortcut('N', '下一部漫画', require('../command/nextArchive'));
    surface.registerKeyboardShortcut('E', '下一部漫画', require('../command/nextArchive'));

    surface.registerKeyboardShortcut('P', '上一部漫画', require('../command/previousArchive'));
    surface.registerKeyboardShortcut('Q', '上一部漫画', require('../command/previousArchive'));

    surface.registerKeyboardShortcut('R', '恢复上次阅读图片', () => surface.restore());

    let changeLayout = require('../command/changeLayout');
    let topBottom = require('../layout/topBottom');
    let oneStep = require('../layout/oneStep');
    surface.registerKeyboardShortcut('1', '切换至两步布局', surface => changeLayout(surface, topBottom));
    surface.registerKeyboardShortcut('2', '切换至单页布局', surface => changeLayout(surface, oneStep));

    surface.registerKeyboardShortcut('I', '显示/隐藏文件名（全屏状态有效）', () => surface.invokeWidget('info', 'toggle'));

    surface.registerKeyboardShortcut('¿', '显示/隐藏帮助', () => surface.invokeWidget('help', 'toggle'));
};
