<!-- 
 * @Name：vusui-layer v1.0 Web弹层组件
 * @Site：http://vusui.com | https://vusui.github.io
 * @Author：林攀 (QQ:45650368)
 * @License：MIT
 * @开发日期：2019-10-30
 * @完成日期：2019-12-04
 * -->
<template>
    <vus-move :options="options" :layer-class="layerClass">
        <div class="vus-layer-content">
            <div v-if="imageArr.length" class="vus-layer-content-scroll" :class="{'no-items':!options.photos.items}">
                <transition :name="imageAnim">
                    <div v-show="imageShow" class="vus-layer-photos-content">
                        <img ref="bigImage" :src="imageArr[imageIndex].src" @mousedown="moveStart" class="img-transition" :class="{move:options.move}" />
                    </div>
                </transition>
                <transition :name="imageAnim">
                    <div v-show="!imageShow" class="vus-layer-photos-content">
                        <img :src="imageArr[imageIndex].src" />
                    </div>
                </transition>
                <div v-if="options.photos.title&&imageArr[imageIndex].alt" class="vus-layer-photos-content-title">
                    {{imageArr[imageIndex].alt}}
                </div>
                <div class="vus-layer-photos-content-count">
                    {{imageIndex+1}} / {{imageArr.length}}
                </div>
                <div v-if="options.photos.button" class="vus-layer-photos-content-btn">
                    <a class="icon icon1" title="左旋转90度" @click="rotateImage('left')"></a>
                    <a class="icon icon3" title="还原" @click="rotateImage('reset')"></a>
                    <a class="icon icon2" title="右旋转90度" @click="rotateImage('right')"></a>
                </div>
                <template v-if="options.photos.arrow">
                    <div class="vus-layer-photos-content-arrow prev" @click="prev(prevIndex)"></div>
                    <div class="vus-layer-photos-content-arrow next" @click="next(nextIndex)"></div>
                </template>
            </div>
        </div>
        <div v-if="options.photos.items" class="vus-layer-photos-list">
            <ul ref="photoScroll" class="vus-layer-photos-list-wrap">
                <li ref="photoItem" v-for="(item,index) in imageArr" :key="index" :class="{active:imageIndex==index}" @click="toImage(index,$event)">
                    <img :src="item.src" :alt="item.alt" :title="item.alt">
                </li>
            </ul>
        </div>
    </vus-move>
</template>

<script>
import vusMove from './vus-move.vue';
import Util from '../common/util.js';
export default {
    name: 'vusPhotos',
    props: {
        options: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data() {
        return {
            layerClass: '',
            imageArr: [],
            imageIndex: this.options.photos.index,
            imageShow: true,
            imageAnim: '',
            currentRotate: 0,
            isMove: false,
            moveLayer: {},
            moveMask: '',
            photos: {
                index: 0,
                arrow: true,
                title: true,
                items: true,
            }
        }
    },
    components: {
        vusMove
    },
    computed: {
        prevIndex() {
            if (this.imageIndex === 0) {
                if (this.options.photos.items && this.$refs.photoScroll) {
                    this.$refs.photoScroll.scrollLeft = this.$refs.photoScroll.scrollWidth;
                }
                return this.imageArr.length - 1;
            } else {
                if (this.options.photos.items && this.$refs.photoScroll) {
                    this.$refs.photoScroll.scrollLeft -= (this.$refs.photoScroll.scrollWidth / this.$refs.photoItem
                        .length);
                }
                return this.imageIndex - 1;
            }
        },
        nextIndex() {
            if (this.imageIndex === this.imageArr.length - 1) {
                if (this.options.photos.items && this.$refs.photoScroll) {
                    this.$refs.photoScroll.scrollLeft = 0;
                }
                return 0;
            } else {
                if (this.options.photos.items && this.$refs.photoScroll) {
                    this.$refs.photoScroll.scrollLeft += (this.$refs.photoScroll.scrollWidth / this.$refs.photoItem
                        .length);
                }
                return this.imageIndex + 1;
            }
        }
    },
    created() {

    },
    async mounted() {
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

        let imageArr = Util.find('img', this.options.content, -1);
        for (let i = 0; i < imageArr.length; i++) {
            let imgSrc = imageArr[i].src;
            let imgAlt = imageArr[i].alt;
            this.imageArr.push({
                src: imgSrc,
                alt: imgAlt
            })
        }
        this.toWhell();
    },
    methods: {
        //拖拽图片
        moveStart(e) {
            e.preventDefault();
            if (this.options.move) {
                this.isMove = true;
                if (this.$refs.bigImage) {
                    this.moveLayer.offset = [
                        e.clientX - parseFloat(this.$refs.bigImage.offsetLeft),
                        e.clientY - parseFloat(this.$refs.bigImage.offsetTop)
                    ];
                    Util.removeClass(this.$refs.bigImage, 'img-transition');
                }
                Util.css(this.moveMask, 'cursor', 'grab');
                Util.show(this.moveMask); //显示拖拽遮罩层vus-layer-move
            }
        },
        //拖拽移动
        move(e) {
            let config = this.options,
                photoEl = this.$refs.bigImage;
            if (this.isMove) {
                e.preventDefault();
                let X = e.clientX - this.moveLayer.offset[0],
                    Y = e.clientY - this.moveLayer.offset[1];

                this.moveLayer.X = this.scrollLeft;
                this.moveLayer.Y = this.scrollTop;

                // 赋值layer坐标
                Util.css(photoEl, {
                    position: 'absolute',
                    left: Util.addpx(X),
                    top: Util.addpx(Y),
                })
            }
        },
        // 结束拖拽
        moveEnd(e) {
            if (this.isMove) {
                this.isMove = false;
                this.moveLayer = [];
                Util.hide(this.moveMask);
                Util.css(this.moveMask, 'cursor', '');
                Util.addClass(this.$refs.bigImage, 'img-transition');
                this.options.moveEnd && this.options.moveEnd(this.$refs.bigImage); //拖拽回调
            }
        },
        toImage(index, event) {
            // 当前选中滚动到居中位置
            if (this.options.photos.items && this.$refs.photoScroll) {
                this.$refs.photoScroll.scrollLeft = event.target.offsetLeft - (this.$refs.photoScroll.clientWidth /
                    2) + (event.target.clientWidth / 2);
            }
            this.imageAnim = 'slide-photos-right';
            this.$refs.bigImage.style = '';
            this.currentRotate = 0;
            this.showImage(index);
        },
        // 滚动到最左边
        prev(index) {
            this.imageAnim = 'slide-photos-left';
            this.$refs.bigImage.style = '';
            this.currentRotate = 0;
            this.showImage(index);
        },
        // 滚动到最右边
        next(index) {
            this.imageAnim = 'slide-photos-right';
            this.$refs.bigImage.style = '';
            this.currentRotate = 0;
            this.showImage(index);
        },
        // 显示大图
        showImage(index) {
            this.imageShow = false;
            setTimeout(() => {
                this.imageShow = true;
                this.imageIndex = index;
            }, 200);
        },
        // 鼠标滚动事件
        toWhell() {
            Util.on(document, 'mousewheel', (event) => {
                event = event || window.event;
                let zoom = 0;
                // 获取当前页面的缩放比，若未设置zoom缩放比，则为默认100%，即1，原图大小
                if (this.$refs.bigImage) {
                    zoom = parseInt(this.$refs.bigImage.style.zoom) || 100;
                }
                // event.wheelDelta 获取滚轮滚动值并将滚动值叠加给缩放比zoom，
                // wheelDelta统一为±120，其中正数表示为向上滚动，负数表示向下滚动
                zoom += event.wheelDelta / 24;
                // 最小范围 和 最大范围 的图片缩放尺度
                if (zoom >= 50 && zoom < 1000) {
                    if (this.$refs.bigImage) {
                        Util.css(this.$refs.bigImage, 'zoom', zoom + '%');
                    }
                }
                return false;

                // 滚轮翻页
                // if (event.wheelDelta > 100 || event.detail < -100) {//向上滚
                //     this.prev(this.prevIndex);
                // } else {//向下滚
                //     this.next(this.nextIndex);
                // }
            })
        },
        rotateImage(val) {
            if (val == 'left') {
                this.currentRotate = this.currentRotate - 90;
                Util.css(this.$refs.bigImage, 'transform', 'rotate(' + this.currentRotate + 'deg)');
            } else if (val == 'right') {
                this.currentRotate = this.currentRotate + 90;
                Util.css(this.$refs.bigImage, 'transform', 'rotate(' + this.currentRotate + 'deg)');
            } else if (val == 'reset') {
                this.currentRotate = 0;
                this.$refs.bigImage.style = '';
            }
        }
    }
}
</script>

<style>
</style>
