/*!
 * @Name：vusui-layer v1.0 Web弹层组件
 * @Site：http://vusui.com | https://vusui.github.io
 * @Author：林攀 (QQ:45650368)
 * @License：MIT
 * @开发日期：2019-10-30
 * @完成日期：2019-12-04
 */
import vusLayer from './components/vus-layer.vue';
import vusMask from './components/vus-mask.vue';
import Util from './common/util.js';
import './theme/default/vusui-layer.css';

export default {
    //插件安装
    install(Vue) {
        let $Layer = Vue.extend(vusLayer);
        let $Mask = Vue.extend(vusMask);
        let index = 0;
        let btns = ['确定', '取消'];
        let globalOption = {};
        
        // 默认配置
        const defaultOption = {
            type: 0, //0(信息框)1(页面层)2(iframe层)3(加载层)4(tips层)5(msg层)6(notify)7(drawer)8(prompt)9(photos)
            title: '信息', //标题 ['文本','font-size:16px;','class']
            content: '', //内容
            contentAlign: 'left', //内容(left=左对齐(默认)/center=居中对齐/right=右对齐)
            shade: 0.2, //遮罩层[0.3, '#fff'] ,0=不显示
            shadeClose: false, //点击遮罩层关闭
            area: 'auto', //宽高
            offset: 'auto', //坐标
            closeBtn: true, //关闭按钮
            time: 0, //0表示不自动关闭,单位是毫秒（1秒=1000毫秒）
            move: true, //是否允许拖拽
            moveOut: false, //是否允许拖拽到窗口外
            // moveEnd: null, //拖动完毕后的回调方法
            scrollbar: true, ////是否允许浏览器滚动条
            // maxmin: false, //最大最小化
            fixed: true, //固定
            maxWidth: 360, //最大宽度
            // maxHeight: '', //最大高度
            resize: false ,//是否允许拉伸，默认是不允许
            // resizing: null, //监听窗口拉伸动作
            anim: 0, //弹出动画,0=平滑放大。默认,-1=无动画效果 0-6
            outAnim: 0, //关闭动画,-1=无动画效果 0-6
            // btn: '', //提示按钮['yes', 'no'],['按钮1', '按钮2', '按钮3', …]
            btnAlign: 'right', //按钮排列(left=左对齐/center=居中对齐/right=右对齐(默认))
            // yes: null, //确定回调
            // cancel: null, //关闭回调
            // success: null,//弹出后回调
            // end: null,//销毁后回调
            icon: -1, //提示图标
            skin: '', //皮肤
            tips: 2, //支持上右下左四个方向，通过1-4进行方向设定,可以设定tips: [1, '#c00']
            tipsMore: false, //是否允许多个tips
            zIndex: 19950512, //层叠顺序
        };
        
        // 在Vue的原型上添加实例方法，以全局调用 vusui 方法
        Vue.prototype.vusui = {
            v: '3.1.0', //版本
            ie: function() { //ie版本
                let agent = navigator.userAgent.toLowerCase();
                return (!!window.ActiveXObject || "ActiveXObject" in window) ? (
                    (agent.match(/msie\s(\d+)/) || [])[1] || '11' //由于ie11并没有msie的标识
                ) : false;
            }(),
            index: 0,
            instances: [],
            instancesVue: [],
            instancesLayer: {
                minIndex: 0,
                minLeft: [],
                end: {},
            },
            instancesNotify: [],
            // 全局配置
            config(options) {
                globalOption = options;
            },
            // 主入口
            open(options) {
                if (this.ie && this.ie < 10) {
                    alert('vusui-layer不支持小于IE10的浏览器!');
                    return false;
                }
                this.index++;
                options = Util.assign(options, defaultOption);
                // 全局配置
                options = Util.extend(options, globalOption);
                // 设置ID
                let id = `vusui-layer-${new Date().getTime()}-${index++}`;
                options.id = id;
                options.zIndex = options.zIndex + index;
                options.vusui = this;
                // 实例化
                let layero = new $Layer({
                    data: {
                        options
                    }
                })
                
                let conType = typeof options.content === 'object';
                if (options.type == 0) {
                    options.btn = ('btn' in options) ? options.btn : btns[0];
                    this.closeAll('msg');
                    this.closeAll('alert');
                } else if (options.type == 1) {
                    options.content = conType ? options.content.innerHTML : options.content;
                } else if (options.type == 2) {
                    // 如果是引入vue组件方式
                    if (options.content && options.content.component) {
                        options.content.component = Vue.extend(options.content.component);
                    } else {
                        options.content = conType ? options.content : [options.content || 'https://vusui.github.io', 'auto'];
                    }
                } else if (options.type == 3) {
                    this.closeAll('loading');
                } else if (options.type == 4) {
                    
                    conType || (options.content = [options.content, 'body']);
                    options.follow = options.content[1];
                    options.content = options.content[0];
                    options.tips = typeof options.tips === 'object' ? options.tips : [options.tips, true];
                    options.tipsMore || this.closeAll('tips');
                } else if (options.type == 7) {
                    // 如果是引入vue组件方式
                    if (options.content && options.content.component) {
                        options.content.component = Vue.extend(options.content.component);
                    } else {
                        options.content = conType ? options.content.innerHTML : options.content;
                    }
                }
                
                // 创建lyaer
                layero.options.id = id;
                this.instances[id] = {
                    inst: layero,
                    type: options.type,
                    options
                }
                
                document.body.appendChild(layero.$mount().$el);
                this.instancesVue[id] = {
                    'mask': '',
                    'layer': layero.$mount(),
                    'iframe': '',
                    'drawer': ''
                }
                
                //是否显示遮罩
                if (options.shade) {
                    let mask = new $Mask({
                        data: {
                            options
                        }
                    });
                    document.body.appendChild(mask.$mount().$el);
                    this.instancesVue[id].mask = mask.$mount();
                }
                
                // 插入拖拽移动层dom
                if (options.move) {
                    let layerMove = Util.$('.vus-layer-move');
                    if (!layerMove) {
                        var moveDom = Util.createDOM('div');
                        moveDom.setAttribute('class', 'vus-layer-move');
                        document.body.append(moveDom);
                    }
                }
                
                return id;
            },
            // alert
            alert(content, options, yes) {
                let type = typeof options === 'function';
                if (type) yes = options;
                return this.open(Util.extend({
                    resize: false,
                    content: content || '',
                    yes: yes,
                }, type ? {} : options));
            },
            // confirm
            confirm(content, options, yes, cancel) {
                let type = typeof options === 'function';
                if (type) {
                    cancel = yes;
                    yes = options;
                }
                return this.open(Util.extend({
                    content: content || '',
                    shadeClose: false,
                    btn: btns,
                    yes: yes,
                    btn2: cancel,
                    icon: 3,
                    resize: false,
                }, type ? {} : options));
            },
            // msg
            msg(content, options, end) {
                let type = typeof options === 'function';
                if (type) end = options;
                this.closeAll('msg');
                this.closeAll('alert');
                return this.open(Util.extend({
                    type: 5,
                    content: content || '',
                    time: 3000,
                    shade: false,
                    title: false,
                    move: false,
                    closeBtn: false,
                    btn: false,
                    resize: false,
                    end: end
                }, type ? {} : function() {
                    options = options || {};
                    if (options.status) {
                        options.offset = 'auto';
                        //success,error,warning,info
                        if (options.status == 'success') {
                            options.icon = options.icon != -1 ? 1 : -1;
                        } else if (options.status == 'error') {
                            options.icon = options.icon != -1 ? 2 : -1;
                        } else if (options.status == 'warning') {
                            options.icon = options.icon != -1 ? 0 : -1;
                        } else if (options.status == 'info') {
                            options.icon = options.icon != -1 ? 4 : -1;
                        } else {
                            options.status = '';
                        }
                    }
                    return options;
                }()));
            },
            load(icon, options) {
                return this.open(Util.extend({
                    type: 3,
                    icon: icon || 0,
                    resize: false,
                    shade: 0.01,
                    closeBtn: false,
                    title: false,
                    move: false,
                    shadeClose: false,
                    anim: 1,
                    outAnim: 1,
                }, options));
            },
            // 通知
            notify(content, options, end) {
                let type = typeof options === 'function';
                if (type) end = options;
                return this.open(Util.extend({
                    type: 6,
                    title: '提示',
                    position: 'rt',
                    content: content || '',
                    time: 5000,
                    shade: false,
                    move: false,
                    btn: false,
                    anim: 5,
                    outAnim: 5,
                    resize: false,
                    end: end
                }, type ? {} : function(){
                    options = options || {};
                    if (options.position) {
                        options.offset = 'auto';
                        options.resize = false;
                        if (options.position == 'lt' || options.position == 'lb') {
                            options.anim = 3;
                            options.outAnim = 3;
                        }
                    }
                    return options;
                }()))
            },
            // 抽屉
            drawer(position, options, end) {
                let type = typeof options === 'function';
                if (type) end = options;
                return this.open(Util.extend({
                    type: 7,
                    move: false,
                    anim: 5,
                    outAnim: 5,
                    maxWidth: '',
                    title: false,
                    closeBtn: false,
                    shadeClose: true,
                    resize: false,
                    position: position || 'right'
                }, type ? {} : function(){
                    options = options || {};
                    options.offset = 'auto';
                    options.resize = false;
                    if (position) {
                        if (position == 'left') {
                            options.anim = 3;
                            options.outAnim = 3;
                        } else if (position == 'top') {
                            options.anim = 4;
                            options.outAnim = 4;
                        } else if (position == 'bottom') {
                            options.anim = 6;
                            options.outAnim = 6;
                        }
                    }
                    return options;
                }()))
            },
            // tips
            tips(content, follow, options) {
                return this.open(Util.extend({
                    type: 4,
                    content: [content, follow],
                    title: false,
                    closeBtn: false,
                    time: 3000,
                    shade: false,
                    resize: false,
                    fixed: false,
                    anim: 1,
                    outAnim: 1,
                    maxWidth: 210,
                    move: false,
                }, options));
            },
            // prompt
            prompt(options, yes) {
                let prompt = '';
                options = options || {};
                if (typeof options === 'function') yes = options;
                let success = options.success;
                delete options.success;
                let promptOption = {
                    type: 1,
                    value: '', //输入值
                    title: '', //标题 ['标题','font-size:20px;']
                    content: '', //内容 ['内容','font-size:20px;']
                    height: '', //输入框高度
                    regular: '', //正则
                    placeholder: '请输入',
                    length: [0, 255], //最小长度和最大长度,0为不限制
                    count: false, //是否显示计算输入长度
                };
                return this.open(Util.extend({
                    type: 8,
                    btn: btns,
                    resize: false,
                    shadeClose: false,
                    prompt: promptOption,
                    success(id, el) {
                        prompt = Util.find('.' + Util.layerClass(6), el);
                        prompt.focus();
                        typeof success === 'function' && success(id, el);
                    },
                    yes(id, el) {
                        options.prompt = Util.extend(promptOption, options.prompt);
                        let value = prompt.value,
                            reg = options.prompt && options.prompt.regular && new RegExp(options.prompt.regular);
                            
                        if (value == '') {
                            Util.addClass(prompt, 'warning');
                            prompt.focus();
                        } else if ((value.length < options.prompt.length[0]) || (value.length > options.prompt.length[1]) || (reg && !reg.test(value))) {
                            Util.addClass(prompt, 'warning');
                            prompt.focus();
                        } else {
                            Util.removeClass(prompt, 'warning');
                            yes && yes(value, id, prompt);
                        }
                    }
                }, options));
            },
            photos(options) {
                return this.open(Util.extend({
                    type: 9,
                    title: false,
                    closeBtn: true,
                    resize: false,
                    shade: 0.6,
                    shadeClose: true,
                    anim: 2,
                    outAnim: 2,
                    maxWidth: '',
                    maxHeight: '',
                    move: true,
                    moveOut: true,
                    fixed: true,
                    scrollbar: false,
                    photos: {
                        index: 0,
                        arrow: true,
                        title: true,
                        items: true,
                        button: true,
                    }
                }, function() {
                    let opt = {
                        shade: options.shade || 0.6,
                        move: options.move,
                        closeBtn: options.closeBtn,
                        content: options.content,
                        photos: options.photos,
                    }
                    return opt;
                }()));
            },
            //设置title内容
            title(name, id) {
                let layerElem = Util.$('#'+id);
                let title = Util.find('.vus-layer-title', layerElem);
                title.innerHTML = name;
            },
            // 关闭一个层
            close(id) {
                let layerElem = Util.$('#'+id);
                let instancesVue = this.instancesVue[id];
                let options = instancesVue && instancesVue.layer.options;
                if (!layerElem) return;
                if (layerElem) {
                    const removeLayer = () => {
                        // document.body.removeChild(layerElem);
                        // 解决操作过快出现:Failed to execute 'removeChild' on 'Node'
                        if (layerElem.parentNode) {
                            layerElem.parentNode.removeChild(layerElem);
                        }
                        delete this.instances[id];
                        instancesVue && instancesVue.layer.$destroy();
                        // iframe
                        if (instancesVue && instancesVue.iframe != '') {
                            instancesVue.iframe.$destroy();
                        }
                        // drawer
                        if (instancesVue && instancesVue.drawer != '') {
                            instancesVue.drawer.$destroy();
                        }
                        // 删除实例
                        delete this.instancesVue[id];
                        // 销毁回调
                        typeof this.instancesLayer.end[id] === 'function' && this.instancesLayer.end[id]();
                        delete this.instancesLayer.end[id];
                    }
                    
                    // 移除in动画,添加out动画
                    if (options.outAnim != -1) {
                        Util.removeClass(layerElem, 'vus-layer-anim-' + options.anim);
                        Util.addClass(layerElem, 'vus-layer-anim-close-' + options.outAnim);
                        // 延时处理(动画效果)
                        setTimeout(() => {
                            Util.hide(layerElem);
                            removeLayer();
                        }, 300);
                    } else {
                        Util.hide(layerElem);
                        removeLayer();
                    }
                    
                    // 移除遮罩层
                    if (options.shade) {
                        let layerMask = Util.$('#' + id + '-mask');
                        if (layerMask) {
                            document.body.removeChild(layerMask);
                            if (instancesVue) {
                               instancesVue.mask.$destroy();
                            }
                        }
                    }
                    
                    //取消隐藏滚动条
                    if (!options.scrollbar) {
                        let htmlID = Util.$('html').getAttribute('scroll-id');
                        if (id == htmlID) {
                            Util.$('html').removeAttribute('style');
                            Util.$('html').removeAttribute('scroll-id');
                        }
                    }
                    
                    // 最大化窗口滚动条设置
                    Util.rescollbar(id);
                    
                    // 最小化窗口索引设置--
                    if (layerElem.getAttribute('min-left')) {
                        this.instancesLayer.minIndex--;
                        this.instancesLayer.minLeft.push(layerElem.getAttribute('min-left'));
                    }
                    
                    // notify
                    if (options.type == 6) {
                        let index = -1;
                        const len = this.instancesNotify.length;
                        const instance = this.instancesNotify.filter((item, i) => {
                            if (item.options.id === id) {
                                index = i;
                                return true;
                            }
                            return false;
                        })[0];
                        
                        if (!instance) return;
                        this.instancesNotify.splice(index, 1);
                        if (len <= 1) return;
                        const position = instance.options.position;
                        const removedHeight = instance.$el.offsetHeight;
                        for (let i = index; i < len - 1 ; i++) {
                            if (this.instancesNotify[i].options.position === position) {
                                this.instancesNotify[i].$el.style[instance.verticalProperty] =
                                    parseInt(this.instancesNotify[i].$el.style[instance.verticalProperty], 10) - removedHeight - 20 + 'px';
                            }
                        }
                    }
                }
            },
            // 关闭所有层
            closeAll(type = -1) {
                if (type == -1) {// 关闭全部层
                    for (let key in this.instances) {
                        this.close(key);
                    }
                } else {// 关闭指定层
                    for (let key in this.instances) {
                        if (this.instances[key].type === Util.typeNumber(type)) {
                            this.close(key);
                        }
                    }
                }
            }
        }
    }
}