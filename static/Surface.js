/**
 * @file 界面逻辑封装类
 * @author otakustay
 */

'use strict';

let WidgetUtil = require('./widget/Util');

const WARN_ANIMATION_STYLE = [
    {opacity: 1},
    {opacity: 0}
];

const WARN_ANIMATION_OPTIONS = {
    duration: 1000,
    iterations: 1,
    delay: 2000
};

const SHORTCUT_DISPLAY_MAPPING = {
    '¿': '/',
    ' ': 'SPACE'
};

/**
 * 界面相关方法封装类
 */
module.exports = class Surface {
    constructor() {
        this.keyboardShortcuts = {};
        this.widgets = {};
        this.warnAnimation = null;
    }

    /**
     * 图片容器
     *
     * @type {HTMLElement}
     */
    get imageContainer() {
        return document.getElementById('main');
    }

    /**
     * 图片元素
     *
     * @type {HTMLElement}
     */
    get imageElement() {
        return document.getElementById('image');
    }

    /**
     * 显示警告信息的标签元素
     *
     * @type {HTMLElement}
     */
    get warnLabel() {
        return document.getElementById('warn');
    }

    /**
     * 创建新图片，替换原有图片
     *
     * @param {Object} imageInfo 图片信息
     * @param {string} imageInfo.uri 图片的DataURI
     * @param {string} imageInfo.path 图片路径
     */
    createNewImage(imageInfo) {
        if (this.imageElement) {
            this.imageElement.remove();
        }

        let img = document.createElement('img');
        img.id = 'image';
        img.src = imageInfo.uri;
        this.imageContainer.appendChild(img);

        this.invokeWidget('info', 'update', imageInfo);
    }

    /**
     * 对图片进行转换
     *
     * @param {meta.Transform} step 当前的阅读步骤
     */
    transformImage(step) {
        let image = this.imageElement;

        if (image.style.transform) {
            image.style.transition = 'transform 1s linear';
        }

        image.style.transform = `scale(${step.scale}) translate3d(${step.translateX}px, ${step.translateY}px, 0)`;
    }

    /**
     * 切换全屏状态
     */
    toggleFullscreen() {
        if (document.webkitIsFullScreen) {
            document.webkitCancelFullScreen();
            document.body.classList.remove('fullscreen');
        }
        else {
            document.documentElement.webkitRequestFullScreen();
            document.body.classList.add('fullscreen');
        }
    }

    /**
     * 判断键盘快捷键是否已被注册
     *
     * @protected
     * @param {string} shortcut 快捷键字符，长度只能为1
     * @return {boolean}
     */
    isKeyboardShortcutRegistered(shortcut) {
        return !!this.keyboardShortcuts[shortcut];
    }

    /**
     * 获取已经注册的键盘快捷键
     *
     * @return {Object[]} 包含`shortcut`和`description`的对象数组
     */
    getRegisteredKeyboardShorts() {
        let keyboardShortcuts = this.keyboardShortcuts;
        let groupByDescription = Object.keys(keyboardShortcuts).reduce(
            (result, shortcut) => {
                let description = keyboardShortcuts[shortcut].description;
                let displayShortcut = SHORTCUT_DISPLAY_MAPPING[shortcut] || shortcut;
                if (result[description]) {
                    result[description].push(displayShortcut);
                }
                else {
                    result[description] = [displayShortcut];
                }
                return result;
            },
            {}
        );
        return Object.keys(groupByDescription).reduce(
            (result, description) => {
                result.push({keys: groupByDescription[description], description: description});
                return result;
            },
            []
        );
    }

    /**
     * 注册键盘快捷键
     *
     * @param {string} shortcut 快捷键字符，长度只能为1
     * @param {string} description 功能说明，用于显示在帮助功能中
     * @param {Function} task 对应的功能函数\
     * @return {boolean} 如果快捷键已经被注册了，会返回`false`
     */
    registerKeyboardShortcut(shortcut, description, task) {
        if (this.isKeyboardShortcutRegistered(shortcut)) {
            return false;
        }

        this.keyboardShortcuts[shortcut] = {description};

        let keyCode = shortcut.charCodeAt(0);
        document.addEventListener(
            'keyup',
            e => {
                if (e.keyCode === keyCode) {
                    task(this.browsingContext);
                }
            },
            false
        );
    }

    /**
     * 显示提示信息
     *
     * @param {string} message 显示的信息
     */
    warn(message) {
        let label = this.warnLabel;
        label.innerText = message;
        label.style.display = 'block';

        if (this.warnAnimation) {
            this.warnAnimation.cancel();
        }

        this.warnAnimation = label.animate(WARN_ANIMATION_STYLE, WARN_ANIMATION_OPTIONS);
        this.warnAnimation.onfinish = () => label.style.display = '';
    }

    /**
     * 注册小组件
     *
     * @param {string} name 小组件名称
     * @param {Object} widget 小组件模块，必须有`render`方法
     */
    registerWidget(name, widget) {
        let util = new WidgetUtil(name);
        widget.render(this.browsingContext, util);

        this.widgets[name] = {widget, util};
    }

    /**
     * 调用小组件的方法
     *
     * @param {string} name 小组件名称
     * @param {string} command 使用的命令
     * @param {*} arg 给定的参数
     * @return {boolean} 调用是否成功
     */
    invokeWidget(name, command, arg) {
        let registry = this.widgets[name];

        if (!registry) {
            return false;
        }

        let task = registry.widget[command];

        if (!task) {
            return false;
        }

        task(this.browsingContext, registry.util, arg);
    }
};
