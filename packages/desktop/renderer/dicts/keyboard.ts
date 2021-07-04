// 恢复上次关闭时的阅读进度，如果没有前次阅读记录，什么也不会发生
export const KEY_RESTORE = ['R'];

// 往后一步。如果图片分多步查看就移动图片，也有可能转到下一页、下一本漫画的第一页
export const KEY_NEXT_STEP = ['J', 'D'];

// 往前一步。如果图片分多步查看就移动图片，也有可能转到上一页、上一本漫画的最后一页
export const KEY_PREVIOUS_STEP = ['K', 'A'];

// 查看下一张图片。可能转到下一本漫画的第一页
export const KEY_NEXT_IMAGE = ['L', 'S'];

// 查看上一张图片。可能转到上一本漫画的最后一页
export const KEY_PREVIOUS_IMAGE = ['H', 'W'];

// 转到下一本漫画
export const KEY_NEXT_BOOK = ['N', 'E'];

// 转到上一本漫画
export const KEY_PREVIOUS_BOOK = ['P', 'Q'];

// 打开、收起标签栏，在阅读时可以操作，可通过标签栏为当前的漫画增加标签
export const KEY_TOGGLE_TAG_LIST = ['T'];

// 显示当前计时，软件会从第一次打开漫画时开始自动计时，为了防止误按，如果当前阅读还不到30秒则不会显示计时
export const KEY_DISPLAY_TIMING = ['C'];

// 显示漫画筛选器，会在界面中央显示筛选功能，可以选择几个自己感兴趣的标签，并从当前阅读的漫画中筛选出同时包含这些标签的
export const KEY_TOGGLE_FILTER = ['U', 'Z'];

// 进入、退出全屏
export const KEY_TOGGLE_FULLSCREEN = ['F'];

// 打开、关闭详细信息面板
export const KEY_TOGGLE_INFO = ['I'];

// 打开、关闭本子选择界面
export const KEY_TOGGLE_BOOK_LIST = ['B'];
