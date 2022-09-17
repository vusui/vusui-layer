# Vusui-layer  Web弹层组件

## 前言
Vusui-layer 是基于 Vue2.x 重构的 Layer.js 组件库。

有组件需求或者 Bug 提交也可以移步到 issues。

## 文档手册
【[查看文档](https://www.vusui.com/layer)】

## 在线演示
【[在线演示](https://www.vusui.com/layer)】


## 开始使用

### npm安装

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

### 方法二：Github

[Git仓库](https://github.com/vusui/vusui-layer) 下载源码并解压，复制 `Vusui-layer` 目录到你指定的目录。

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
