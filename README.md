# 小薄本 - 专注单手看漫画

为什么要专注**单手**，看名字你就知道。

你是否有在观看小薄本的时候有过这样那样的尴尬或者不爽：

- 普通的看图软件一个屏幕一张图，需要手工缩放，并不适合漫画的阅读。
- 每张图片大小不一样，需要不断调整缩放，费时费力没了兴致。
- “聪明”的看图软件总能记住你上次看了什么，一不小心在他人面前打开，求心理阴影面积……
- 看着看着跑进来个外人。基友你听我说真的不是这样的，我爱的是你啊！

我们来为你解决这些不快，专为观看小东西而打造的应用，它有如下的特点：

1. 只用键盘进行观看，快捷键为单手操作特别设计，另一只手空出来做些该做的事。
2. 专门优化的图片智能缩放，保证全程无需调整缩放。
3. 没有你的指示，绝不恢复任何状态，每一次打开都人畜无害，再也不怕手贱。
4. 打扰模式随时准备保护你的隐私，只需按下空格键，你就只是一个逛着淘宝的剁手族。
5. 全屏专注阅读，不留任何多余内容影响心情。

我们正在不断努力，添加更多实用功能，力求打造最好的小薄本应用。

## 如何使用

打开应用后，根据提示将目录或`.zip`文件拖拽至窗口内即可。

在应用中按下`/`键可以查看具体快捷键说明。

### 默认布局

默认布局采用了数百小薄本观看体验中挖掘出来的最为合适的“两步式”方案，此布局目标为采用1-2步完成一页漫画的阅读，其逻辑如下：

1. 如果图片本身比屏幕小，则等比例放大图片到屏幕尺寸，宽高先到为止。
2. 如果图片比较宽导致纵向合理的情况下横向会超出容器大小，则等比缩小宽度到容器宽度。
3. 如果图片高度小于容器高度的2倍，则不对图片进行缩放，分2步显示，2步显示的内容有所重叠。
4. 如果图片高度大于等于容器高度的2倍，则等比缩小图片高度到2倍容器高度，分2步显示。

此模式用于全屏观看可以获得极佳的体验，你也可以使用数字键切换至不同的布局，具体请按下`/`键查看说明。

## 进行开发

### 简单运行

```shell
npm i
npm run start
```

### 编译

```shell
npm i
npm run package
```

由于需要在OS X下编译Windows二进制需要的环境较为复杂，因此当前仅支持OS X的编译。Icarus的编译依赖 [electron-forge](https://github.com/electron-userland/electron-forge) 包，如果你对其有了解，可以自行编译Windows版本
