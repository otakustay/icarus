/**
 * @file 小组件相关工具类
 * @author otakustay
 */

'use strict';

let etpl = require('etpl');
let denodeify = require('denodeify');
let readFile = denodeify(require('fs').readFile);
let path = require('path');

/**
 * 用于组件的工具类
 */
module.exports = class Util {

    /**
     * 构造函数
     *
     * @param {string} widgetName 组件名称
     */
    constructor(widgetName) {
        this.widgetName = widgetName;
        this.templateEngine = new etpl.Engine();
        this.templateEngine.addFilter('upper', s => s.toUpperCase());
        this.templateEngine.addFilter('lower', s => s.toLowerCase());
    }

    /**
     * 渲染指定的模板
     *
     * @param {string} target 指定模板target，如不指定则使用默认target
     * @param {Object} data 渲染模板用的数据
     * @return {string}
     */
    renderTemplate(target, data) {
        return this.templateEngine.getRenderer(target)(data);
    }

    /**
     * 初始化解析模板
     *
     * @return {Promise}
     */
    initTemplate() {
        let engine = this.templateEngine;

        let file = path.join(__dirname, this.widgetName, `${this.widgetName}.tpl.html`);
        return readFile(file, 'utf-8').then(engine.parse.bind(engine));
    }

    /**
     * 渲染CSS文件
     */
    initStyle() {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `widget/${this.widgetName}/${this.widgetName}.css`;
        document.head.appendChild(link);
    }

    /**
     * 使用一段HTML创建一个DOM元素
     *
     * @protected
     * @param {string} html HTML串
     * @return {HTMLElement} HTML串中的第一个元素
     */
    createElementFromHTML(html) {
        let div = document.createElement('div');
        div.innerHTML = html;
        return div.firstElementChild;
    }
};
