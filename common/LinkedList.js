/**
 * @file 链表实现
 * @author otakustay
 */

'use strict';

const CURSOR = Symbol('cursor');
const LIST = Symbol('list');

/**
 * 简单的链表实现
 */
module.exports = class LinkedList {

    /**
     * 构造函数
     *
     * @param {Array} list 输入的数组
     */
    constructor(list) {
        this[LIST] = list;
        this[CURSOR] = -1;
    }

    /**
     * 获取当前节点
     *
     * @return {*} 当前节点
     */
    current() {
        return this[LIST][this[CURSOR]];
    }

    /**
     * 获取下一个节点
     *
     * @return {*} 下一个节点，如果已经在末尾则返回`null`
     */
    next() {
        let list = this[LIST];
        this[CURSOR] = Math.min(list.length, this[CURSOR] + 1);
        return list[this[CURSOR]] || null;
    }

    /**
     * 获取上一个节点
     *
     * @return {*} 上一个节点，如果已经在头部则返回`null`
     */
    previous() {
        let list = this[LIST];
        this[CURSOR] = Math.max(-1, this[CURSOR] - 1);
        return list[this[CURSOR]] || null;
    }

    /**
     * 移动到指定节点之前的位置，以便下次调用`next()`能获取指定节点
     *
     * @param {*} element 指定节点
     */
    readyFor(element) {
        this[CURSOR] = element ? this[LIST].indexOf(element) - 1 : -1;
    }

    /**
     * 将链表转换为数组
     *
     * @return {Array} 转换后的数组，与构造函数传入的数组不是同一个引用
     */
    toArray() {
        return Array.from(this[LIST]);
    }
};
