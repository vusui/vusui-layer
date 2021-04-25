# Vusui-layer

## 前言
Vusui-layer 的诞生，参考了 Layer.js、Element 及其他技术社区上一些优秀的资源。

开源不仅是分享，也是协作，通过社区的力量解决问题，促进发展。期待你的参与！

有组件需求或者 Bug 提交也可以移步到 issues。

## API 文档手册
[查看API文档](https://vusui.gitee.io/#/layer/preface)

## 在线演示
<p align="left"><a href="https://vusui.gitee.io/#/layer/preface" target="_blank" rel="noopener noreferrer">在线演示</a></p>


## 开始使用

### 方法一： npm 安装

```
$ npm install vusui-layer --save
```

```
import Vue from 'vue';
import App from './App.vue';

// 引入vusui-layer
import Vusui from 'vusui-layer';
Vue.use(Vusui);

new Vue({
    el: '#app',
    render: h => h(App)
});
```

### 方法二：`Git仓库` 或者 `官网` 下载源码解压，复制 `Vusui-layer` 目录到你指定的目录。

```
import Vue from 'vue';
import App from './App.vue';

// 引入vusui-layer
import Vusui from './vusui/vusui-layer.js'; //vusui-layer 的存放目录位置
Vue.use(Vusui);

new Vue({
    el: '#app',
    render: h => h(App)
});

```

## License
[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, VusUI