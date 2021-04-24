<!-- 
 * @Name：vusui-layer v1.0 Web弹层组件
 * @Site：http://vusui.com | https://vusui.github.io
 * @Author：林攀 (QQ:45650368)
 * @License：MIT
 * @开发日期：2019-10-30
 * @完成日期：2019-12-04
 * -->
<template>
    <div class="vus-layer vus-layer-anim" :id="options.id" :class="[setLayerClass,layerClass]" :style="[setLayerStyle,layerStyle,positionStyle]" :type="type" :index="options.zIndex" tabindex="1">
        <div v-if="options.title&&options.type!=5&&isNoneTB" class="vus-layer-title" :class="titleType&&options.title[2]?options.title[2]:''" :style="setTitleStyle" @mousedown="moveStart" v-html="titleType?options.title[0]:options.title"></div>
        <div v-if="options.closeBtn||options.maxmin" class="vus-layer-title-icon" :class="!options.title?(options.type==4||options.type==5?'none-title-msg':'none-title'):(options.type==4||options.type==5)?'none-title-msg':''">
            <!-- 如果有标题栏和最大最小按钮 -->
            <template v-if="options.title&&isMinMax">
                <template v-if="isMinMaxState==0">
                    <a class="icon vus-layer-min" title="最小化" @click="winMin"></a>
                    <a class="icon vus-layer-max" title="最大化" @click="winMax"></a>
                </template>
                <template v-else-if="isMinMaxState==1||isMinMaxState==2">
                    <a class="icon vus-layer-restore" title="还原" @click="winRestore"></a>
                </template>
            </template>
            <!-- 如果有关闭按钮 -->
            <template v-if="options.closeBtn&&options.type!=3">
                <a v-if="options.title&&isNoneT" class="icon vus-layer-close1" title="关闭" @click="winClose"></a>
                <template v-else>
                    <a v-if="options.type!=4&&options.type!=5" class="icon vus-layer-close2" title="关闭" @click="winClose"></a>
                    <template v-else>
                        <a :class="'icon vus-layer-close'+(!options.status?'4':'3')" title="关闭" @click="winClose"></a>
                    </template>
                </template>
            </template>
        </div>
        <slot></slot>
        <vus-button v-if="options.btn&&isNoneTB" :options="options" @click="btnClick"></vus-button>
        <div v-if="options.resize&&isMinMaxState==0&&isNoneTB" class="vus-layer-resize" @mousedown="resizeStart"></div>
    </div>
</template>

<script>
import Util from '../common/util.js';
import vusButton from './vus-button.vue';
export default {
    name: 'vusMove',
    props: {
        options: {
            type: Object,
            default: function() {
                return {}
            }
        },
        layerClass: {
            type: [String, Object],
            default: ''
        },
        layerStyle: {
            type: [String, Object],
            default: ''
        }
    },
    data() {
        return {
            id: "vusui-layer-move-" + new Date().getTime(),
            type: Util.typeString(this.options.type),
            titleType: typeof this.options.title === 'object',
            conType: typeof this.options.content === 'object',
            moveMask: '', //拖拽移动层
            moveLayer: {}, //拖拽移动指令
            addStyle: {},
            isMove: false,
            isResize: false,
            isMinMax: false,
            isMinMaxState: 0,
            isBorder: 0,
            verticalOffset: 0,
            isNoneT: this.options.type != 3 && this.options.type != 4 && this.options.type != 5 && this.options.type != 9,
            isNoneTB: this.options.type != 3 && this.options.type != 4 && this.options.type != 9,
            screenWidth: document.documentElement.clientWidth || document.body.clientWidth,
            screenHeight: document.documentElement.clientHeight || document.body.clientHeight,
            scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
            scrollLeft: document.documentElement.scrollLeft || document.body.scrollLeft
        };
    },
    components: {
        vusButton
    },
    computed: {
        setLayerStyle() {
            let config = this.options;
            return Object.assign({
                width: Util.addpx(config.area[0]),
                height: Util.addpx(config.area[1]),
                top: Util.addpx(config.offset[1]),
                left: Util.addpx(config.offset[0]),
                zIndex: config.zIndex,
                position: config.fixed ? 'fixed' : 'absolute',
            }, this.addStyle);
        },
        setLayerClass() {
            let config = this.options,
                styles = `vus-layer-${Util.typeString(config.type)}`;
            
            if ((config.type == 0 || config.type == 1 || config.type == 2 || config.type == 8) && !config.shade) {
                styles = `${styles} vus-layer-border`;
            }
            if (config.anim != -1) {
                styles = `${styles} vus-layer-anim-${config.anim}`;
            }
            if (config.skin) {
                styles = `${styles} ${config.skin}`;
            }
            return styles;
        },
        setTitleStyle() {
            return `${this.options.move ? 'cursor:move;' : ''}${this.titleType ? this.options.title[1] : ''}`;
        },
        verticalProperty() {
            if (/^(lt|rt)/.test(this.options.position)) {
                return 'top';
            } else if (/^(lb|rb)/.test(this.options.position)) {
                return 'bottom';
            }
        },
        positionStyle() {
            if (this.options.type == 6) {
                return {
                    [this.verticalProperty]: `${this.verticalOffset }px`
                }
            }
        }
    },
    created() {
        // 滚动事件
        Util.on(window, 'scroll', () => {
            this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            this.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        });
        // 自适应浏览器窗口尺寸
        Util.on(window, 'resize', () => {
            return (() => {
                this.screenWidth = document.documentElement.clientWidth || document.body.clientWidth;
                this.screenHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                this.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                if (this.options.fixed) {
                    this.options.type == 4 && this.tips();
                    (this.options.type != 6 && this.options.type != 7 && this.options.type != 9) && this.offset();
                    (/^\d+%$/.test(this.options.area[0]) || /^\d+%$/.test(this.options.area[1])) && this.auto();
                }
            })();
        })
    },
    async mounted() {
        // 加载骨架
        this.creat();
        
        // 移动拖拽
        if (this.options.move) {
            await Util.sleep(10);
            // 拖拽遮罩层
            this.moveMask = Util.$('.vus-layer-move');
            
            // 开始拖拽
            Util.on(document, 'mousemove', event => {
                this.move(event);
            });
            
            // 结束拖拽
            Util.on(document, 'mouseup', event => {
                this.moveEnd(event);
            });
        }
    },
    methods: {
        // 创建骨架
        creat() {
            let config = this.options,
                layerEl = this.$e;
                
            // 宽高
            if (typeof config.area === 'string') {
                config.area = config.area === 'auto' ? ['',''] : [config.area, ''];
            } else if (typeof config.area === 'number') {
                config.area = [config.area, ''];
            }
            
            // 获取更新后的 DOM
            this.$nextTick(() => {
                // notify
                if (this.options.type == 6) {
                    const position = this.options.position || 'rt';
                    this.options.vusui.instancesNotify.filter(item => item.options.position === position).forEach(item => {
                        this.verticalOffset += item.$el.offsetHeight + 20;
                    });
                    this.verticalOffset += 20;
                    this.options.vusui.instancesNotify.push(this);
                }
                
                // 自适应
                this.options.type != 9 && this.auto();
                
                // 计算坐标
                this.options.type == 4 && this.tips();
                (config.type == 4 || config.type == 6 || config.type == 7) ? '' : this.offset();
                
                // 只有page和iframe层有最大最小化按钮
                this.isMinMax = config.maxmin && (config.type === 1 || config.type === 2);
                
                // 设置自动关闭时间
                config.time <= 0 || setTimeout(() => {
                    Util.close(this.options);
                }, config.time);
                
                // 回调
                this.callback();
            });
        },
        //自适应
        auto() {
            let config = this.options,
                layerEl = this.$el;
            
            // 设置宽度
            if (config.area[0] === '' && config.maxWidth > 0) {
                layerEl.clientWidth > config.maxWidth && Util.css(layerEl, 'width', Util.addpx(config.maxWidth));
            }
            
            let layerArea = [layerEl.clientWidth, layerEl.clientHeight],
                titHeight = Util.find('.' + Util.layerClass(0), layerEl),
                btnHeight = Util.find('.' + Util.layerClass(1), layerEl);
                
            // 获取标题与按钮容器高度
            titHeight = titHeight && titHeight.offsetHeight || 0;
            btnHeight = btnHeight && btnHeight.offsetHeight || 0;
            
            // 设置高度
            let setHeight = function(elem) {
                elem =  Util.find(elem, layerEl);
                Util.css(elem, 'height', Util.addpx(layerArea[1] - titHeight - btnHeight));
            }
            
            switch (config.type) {
                case 2:
                    setHeight('.' + Util.layerClass(3));
                    break;
                default:
                    if (config.area[1] === '') {
                        if (config.maxHeight > 0 && layerArea[1] > config.maxHeight) {
                            layerArea[1] = config.maxHeight;
                            setHeight('.' + Util.layerClass(2));
                        } else if (config.fixed && layerArea[1] >= this.screenHeight) {
                            layerArea[1] = this.screenHeight;
                            setHeight('.' + Util.layerClass(2));
                        }
                    } else {
                        setHeight('.' + Util.layerClass(2));
                    }
                    break;
            }
        },
        // 计算坐标
        offset() {
            let config = this.options,
                layerEl = this.$el,
                layerArea = [layerEl.offsetWidth, layerEl.offsetHeight],
                offsetType = typeof config.offset === 'object';

            let offsetTop = (this.screenHeight - layerArea[1]) / 2,
                offsetLeft = (this.screenWidth - layerArea[0]) / 2;
            
            if (offsetType) {
                offsetTop = config.offset[0];
                offsetLeft = config.offset[1] || offsetLeft;
            } else if (config.offset !== 'auto') {
                if (config.offset === 'l') { //左
                    offsetLeft = 0;
                } else if (config.offset === 't') {//上
                   offsetTop = 0;
                } else if (config.offset === 'r') {//右
                    offsetLeft = this.screenWidth - layerArea[0];
                } else if (config.offset === 'b') {//下
                    offsetTop = this.screenHeight - layerArea[1];
                } else if (config.offset === 'lt') { //左上角
                    offsetTop = 0;
                    offsetLeft = 0;
                } else if (config.offset === 'rt') { //右上角
                    offsetTop = 0;
                    offsetLeft = this.screenWidth - layerArea[0];
                } else if (config.offset === 'rb') { //右下角
                    offsetTop = this.screenHeight - layerArea[1];
                    offsetLeft = this.screenWidth - layerArea[0];
                } else if (config.offset === 'lb') { //左下角
                    offsetTop = this.screenHeight - layerArea[1];
                    offsetLeft = 0;
                } else {
                    offsetTop = config.offset;
                }
            }
            
            // layer不是固定时(随滚动条移动)
            if (!config.fixed) {
                offsetTop = /%$/.test(offsetTop) ? this.screenHeight * parseFloat(offsetTop) / 100 : parseFloat(offsetTop);
                offsetLeft = /%$/.test(offsetLeft) ? this.screenWidth * parseFloat(offsetLeft) / 100 : parseFloat(offsetLeft);
                offsetTop += this.scrollTop;
                offsetLeft += this.scrollLeft;
            }
            
            // 最小化
            if (layerEl.getAttribute('min-left')) {
                let titHeight = Util.find('.' + Util.layerClass(0), layerEl);
                titHeight = titHeight && titHeight.offsetHeight || 0;
                offsetTop = this.screenHeight - titHeight;
                offsetLeft = Util.css(layerEl, 'left');
            }
            
            // 赋值layer坐标
            this.addStyle = {
                left: Util.addpx(offsetLeft),
                top: Util.addpx(offsetTop),
            }
        },
        // 提示
        tips() {
            let config = this.options,
                layerEl = this.$el;

            let layerArea = [layerEl.offsetWidth, layerEl.offsetHeight],
                follow = Util.$(config.follow);
                
            if (!follow) follow = Util.$('body');
            let styles = {
                    width: follow.offsetWidth,
                    height: follow.offsetHeight,
                    top: Util.getOffset(follow).top,
                    left: Util.getOffset(follow).left
                },
                tipsArrow = Util.find('.' + Util.layerClass(4), layerEl);
               
            let position = config.tips[0] || 1;
            config.tips[1] || layerEl.removeChild(tipsArrow);
            
            styles.autoLeft = () => {
                if (styles.left + layerArea[0] - this.screenWidth > 0) {
                    styles.tipLeft = styles.left + styles.width - layerArea[0];
                    Util.css(tipsArrow, {
                        right: '12px',
                        left: 'auto'
                    });
                } else {
                    styles.tipLeft = styles.left;
                };
            };
            
            //辨别tips的方位
            styles.where = [() => { //上
                styles.autoLeft();
                styles.tipTop = styles.top - layerArea[1] - 12;
                Util.removeClass(tipsArrow, 'vus-layer-tips-bottom');
                Util.addClass(tipsArrow, 'vus-layer-tips-top');
                Util.css(tipsArrow, 'border-right-color', config.tips[1]);
            }, () => { //右
                styles.tipLeft = styles.left + styles.width + 12;
                styles.tipTop = styles.top;
                Util.removeClass(tipsArrow, 'vus-layer-tips-left');
                Util.addClass(tipsArrow, 'vus-layer-tips-right');
                Util.css(tipsArrow, 'border-bottom-color', config.tips[1]);
            }, () => { //下
                styles.autoLeft();
                styles.tipTop = styles.top + styles.height + 12;
                Util.removeClass(tipsArrow, 'vus-layer-tips-top');
                Util.addClass(tipsArrow, 'vus-layer-tips-bottom');
                Util.css(tipsArrow, 'border-right-color', config.tips[1]);
            }, () => { //左
                styles.tipLeft = styles.left - layerArea[0] - 12;
                styles.tipTop = styles.top;
                Util.removeClass(tipsArrow, 'vus-layer-tips-right');
                Util.addClass(tipsArrow, 'vus-layer-tips-left');
                Util.css(tipsArrow, 'border-bottom-color', config.tips[1]);
            }];
            styles.where[position - 1]();
            
            /* 10*2为小三角形占据的空间 */
            if (position === 1) {
                styles.top - (this.scrollTop + layerArea[1] + 10 * 2) < 0 && styles.where[2]();
            } else if (position === 2) {
                this.screenWidth - (styles.left + styles.width + layerArea[0] + 10 * 2) > 0 || styles.where[3]()
            } else if (position === 3) {
                (styles.top - this.scrollTop + styles.height + layerArea[1] + 10 * 2) - this.screenHeight > 0 && styles.where[0]();
            } else if (position === 4) {
                layerArea[0] + 10 * 2 - styles.left > 0 && styles.where[1]()
            } else {
                styles.top - (this.scrollTop + layerArea[1] + 10 * 2) < 0 && styles.where[2]();
            }
            
            let contentDom = Util.find('.' + Util.layerClass(5), layerEl)
            Util.css(contentDom, {
                'background-color': config.tips[1],
                'padding-right': (config.closeBtn ? '30px' : '')
            });
            
            Util.css(layerEl, {
                left: Util.addpx(styles.tipLeft),
                top: Util.addpx(styles.tipTop)
            });
        },
        // 回调
        callback() {
            let config = this.options,
                layerEl = this.$el;
                
            // 是否禁用滚动条
            if (!config.scrollbar) {
                Util.css(Util.$('html'), 'overflow', 'hidden');
                if (!Util.$('html').getAttribute('scroll-id')) {
                    Util.$('html').setAttribute('scroll-id', config.id);
                }
            }
            
            // 弹出成功后回调
            if (config.success && typeof(config.success) == 'function') {
                if (config.type == 2) {
                    let iframe = Util.find('.' + Util.layerClass(3), layerEl);
                    Util.on(iframe, 'load', () => {
                        config.success(config.id, layerEl);
                    });
                } else {
                    config.success(config.id, layerEl);
                }
            }
            
            // 销毁后回调
            config.end && (config.vusui.instancesLayer.end[config.id] = config.end);
        },
        // 设置层的样式
        styles(options, limit) {
            let config = this.options,
                layerEl = this.$el, 
                layerType = layerEl.getAttribute('type'),
                contElem = Util.find('.' + Util.layerClass(2), layerEl),
                titHeight = Util.find('.' + Util.layerClass(0), layerEl),
                btnHeight = Util.find('.' + Util.layerClass(1), layerEl);
            
            // 获取标题与按钮容器高度
            titHeight = titHeight && titHeight.offsetHeight || 0;
            btnHeight = btnHeight && btnHeight.offsetHeight || 0;
            
            if (layerType === Util.typeString(3) || layerType === Util.typeString(4) || layerType === Util.typeString(5)) {
                return;
            }
            
            // 限制最小宽高
            if (!limit) {
                if (parseFloat(options.width) <= 260) {
                    options.width = Util.addpx(260);
                }
                if (parseFloat(options.height) - titHeight - btnHeight <= 62) {
                    options.height = 62 + titHeight + btnHeight;
                }
                
            }
            
            // 设置新样式
            Util.css(layerEl, options);
            
            // 设置内容容器与iframe高度
            if (layerType === Util.typeString(2)) {
                let iframe = Util.find('.' + Util.layerClass(3), layerEl);
                Util.css(iframe, 'height', Util.addpx(parseFloat(options.height) - titHeight - btnHeight));
            } else {
                Util.css(contElem, 'height', Util.addpx(parseFloat(options.height) - titHeight - btnHeight));
            }
        },
        //拖拽层
        moveStart(e) {
            e.preventDefault();
            if (this.options.move) {
                this.isMove = true;
                this.moveLayer.offset = [
                    e.clientX - parseFloat(this.$el.offsetLeft),
                    e.clientY - parseFloat(this.$el.offsetTop)
                ];
                Util.css(this.moveMask, 'cursor', 'move');
                Util.show(this.moveMask); //显示拖拽遮罩层vus-layer-move
            }
        },
        // 拉伸层
        resizeStart(e) {
            e.preventDefault();
            this.isResize = true;
            this.moveLayer.offset = [e.clientX, e.clientY];
            this.moveLayer.area = [
                parseFloat(this.$el.clientWidth),
                parseFloat(this.$el.clientHeight)
            ];
            Util.css(this.moveMask, 'cursor', 'se-resize');
            Util.show(this.moveMask); //显示拖拽遮罩层vus-layer-move
        },
        //拖拽移动
        move(e) {
            let config = this.options,
                layerEl = this.$el;
            if (this.isMove) {
                e.preventDefault();
                let X = e.clientX - this.moveLayer.offset[0],
                    Y = e.clientY - this.moveLayer.offset[1],
                    fixed = Util.getStyle(layerEl, 'position') == 'fixed';
                    
                this.moveLayer.X = fixed ? 0 : this.scrollLeft;
                this.moveLayer.Y = fixed ? 0 : this.scrollTop;

                //控制元素不被拖出窗口外
                if (!config.moveOut) {
                    let right = document.documentElement.clientWidth - layerEl.offsetWidth + this.moveLayer.X,
                        bottom = document.documentElement.clientHeight - layerEl.offsetHeight + this.moveLayer.Y;
                    X < this.moveLayer.X && (X = this.moveLayer.X);
                    X > right && (X = right);
                    Y < this.moveLayer.Y && (Y = this.moveLayer.Y);
                    Y > bottom && (Y = bottom);
                }
                
                // 赋值layer坐标
                this.addStyle = {
                    left: Util.addpx(X),
                    top: Util.addpx(Y)
                }
            }
            
            //拉伸
            if (config.resize && this.isResize) {
                e.preventDefault();
                let X = e.clientX - this.moveLayer.offset[0],
                    Y = e.clientY - this.moveLayer.offset[1];
                    
                // 更新样式
                this.styles({
                    width: Util.addpx(this.moveLayer.area[0] + X),
                    height: Util.addpx(this.moveLayer.area[1] + Y),
                    maxWidth: '100%',
                });
                
                //监听窗口拉伸动作回调
                config.resizing && config.resizing(layerEl); 
            }
        },
        // 结束拖拽
        moveEnd(e) {
            if (this.isMove) {
                this.isMove = false;
                this.moveLayer = [];
                Util.hide(this.moveMask);
                Util.css(this.moveMask, 'cursor', '');
                this.options.moveEnd && this.options.moveEnd(this.$el); //拖拽回调
            }
            if (this.isResize) {
                this.isResize = false;
                this.moveLayer = [];
                Util.hide(this.moveMask);
                Util.css(this.moveMask, 'cursor', '');
            }
        },
        // 按钮点击事件
        btnClick(index) {
            let config = this.options,
                layerEl = this.$el;
            
            if (index === 0) {
                if (typeof(config.yes) == 'function') {
                    config.yes(config.id, layerEl);
                } else if (typeof(config['btn1']) == 'function') {
                    config['btn1'](config.id, layerEl);
                } else {
                    Util.cancel(layerEl, config);
                }
            } else {
                Util.cancel(layerEl, config, index + 1);
            }
        },
        // 关闭事件
        winClose() {
            Util.close(this.options);
        },
        // 最小化
        winMin() {
            let config = this.options,
                layerEl = this.$el,
                min = config.min && config.min(config.id, layerEl),
                titHeight = Util.find('.' + Util.layerClass(0), layerEl),
                left = layerEl.getAttribute('min-left') || (181 * config.vusui.instancesLayer.minIndex),
                position = Util.getStyle(layerEl, 'position');
            
            titHeight = titHeight && titHeight.offsetHeight || 0;
            
            // 如果回调不是 return false;
            if (min !== false) {
                // 按钮状态
                this.isMinMaxState = 1;
                // 设置属性参数
                this.winRecord(layerEl);
                // 设置最小化位置顺序
                if (config.vusui.instancesLayer.minLeft[0]) {
                    left = config.vusui.instancesLayer.minLeft[0];
                    config.vusui.instancesLayer.minLeft.shift();
                }
                // 设置样式
                this.styles({
                    width: Util.addpx(180),
                    height: Util.addpx(titHeight),
                    left: Util.addpx(left),
                    top: Util.addpx(document.documentElement.clientHeight - titHeight),
                    position: 'fixed',
                    overflow: 'hidden'
                }, true);
                // 索引递增
                if (!layerEl.getAttribute('min-left')) {
                    config.vusui.instancesLayer.minIndex++;
                }
                Util.rescollbar(config.id);
                layerEl.setAttribute('position', position);
                layerEl.setAttribute('min-left', Util.addpx(left));
            }
        },
        // 最大化窗口
        winMax() {
            let config = this.options,
                layerEl = this.$el,
                position = Util.getStyle(layerEl, 'position');
            
            // 设置按钮状态
            this.isMinMaxState = 2;
            this.winRecord(layerEl);
            
            // 全屏状态下禁用html滚动条
            if (!Util.$('html').getAttribute('full-id')) {
                Util.css(Util.$('html'), 'overflow', 'hidden');
                Util.$('html').setAttribute('full-id', config.id)
            }
            
            this.$nextTick(() => {
                this.styles({
                    top: position === 'fixed' ? 0 : Util.addpx(this.scrollTop),
                    left: position === 'fixed' ? 0 : Util.addpx(this.scrollLeft),
                    width: Util.addpx(document.documentElement.clientWidth),
                    height: Util.addpx(document.documentElement.clientHeight),
                    position: position,
                    boxSizing: 'border-box'
                }, true);
            });
            layerEl.setAttribute('position', position);
        },
        // 还原窗口
        winRestore() {
            let config = this.options,
                layerEl = this.$el,
                area = layerEl.getAttribute('area').split(',');
                
            this.isMinMaxState = 0;
            this.styles({
                width: Util.addpx(parseFloat(area[0])),
                height: Util.addpx(parseFloat(area[1])),
                top: Util.addpx(parseFloat(area[2])),
                left: Util.addpx(parseFloat(area[3])),
                position: layerEl.getAttribute('position'),
                overflow: 'visible',
                boxSizing: 'content-box'
            }, true);
            Util.rescollbar(config.id);
        },
        // 设置最小最大还原坐标
        winRecord(elem) {
            let area = [
                elem.offsetWidth,
                elem.offsetHeight,
                elem.offsetTop,
                elem.offsetLeft
            ];
            elem.setAttribute('area', area);
        }
    },
    watch: {
        screenWidth(newVal) {
            this.screenWidth = newVal;
        },
        screenHeight(newVal) {
            this.screenHeight = newVal;
        },
        scrollTop(newVal) {
            this.scrollTop = newVal;
        },
        scrollLeft(newVal) {
            this.scrollLeft = newVal;
        },
        verticalOffset(newVal) {
            this.verticalOffset = newVal;
        }
    },
    destroyed() {
        let layero = Util.$('.vus-layer', -1);
        let move = Util.$('.vus-layer-move');
        if (!layero.length && move) {
            // 清容最大最小化事件
            this.options.vusui.instancesLayer.minIndex = 0;
            this.options.vusui.instancesLayer.minLeft = [];
            // 移除拖拽层
            document.body.removeChild(move);
        }
    }
}
</script>

<style>
</style>
