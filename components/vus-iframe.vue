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
        <div class="vus-layer-content" :class="setContentClass">
            <div class="vus-layer-content-scroll">
                <div v-if="options.content&&options.content.component" class="vus-layer-content-iframe" :id="id"></div>
                <template v-else>
                    <iframe class="vus-layer-content-iframe" allowtransparency="true" frameborder="0" :id="id" :name="id" :ref="id" :src="options.content[0]" :scrolling="options.content[2]||'auto'"></iframe>
                </template>
            </div>
        </div>
    </vus-move>
</template>

<script>
import vusMove from './vus-move.vue';
import Util from '../common/util.js';
export default {
    name: 'vusIframe',
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
            id: "vusui-layer-iframe-" + new Date().getTime(),
            layerClass: '',
        }
    },
    components: {
        vusMove
    },
    computed: {
        setContentClass() {
            let styles = '',
                config = this.options;
            
            if (!config.title && !config.btn) {
                styles = 'vus-layer-content-radius';
            } else if (!config.title) {
                styles = 'vus-layer-content-radius-title';
            } else if (!config.btn) {
                styles = 'vus-layer-content-radius-button';
            }
            return styles;
        }
    },
    created() {
        // 接收获取iframe数据方法
        // window.onmessage = (e) => {
        //     console.log(e.data)
        //     this.vusui.close(e.data.layerID)
        // };
    },
    mounted() {
        if (this.options.content && this.options.content.component) {
            this.getContent();
        } else {
            this.setIframeData();
        }
    },
    methods: {
        async getContent() {
            await Util.sleep(10);
            let config = this.options;
            let iframeID = Util.$('#' + this.id);
            let propsData = Util.deepClone(config.content.data) || {};
            propsData['layerID'] = config.id;
            propsData['layerData'] = config.content.data;
            let instance = new config.content.component({
                //具体参数信息，请参考vue源码
                parent: config.content.parent,
                propsData: propsData
            });
            iframeID.appendChild(instance.$mount().$el);
            config.vusui.instancesVue[config.id].iframe = instance.$mount();
        },
        // 传递数据到iframe页面
        async setIframeData() {
            await Util.sleep(10);
            let mapFrame = this.$refs[this.id];
            Util.on(mapFrame, 'load', () => {
                let iframeWin = mapFrame.contentWindow
                iframeWin.postMessage({
                    layerID:  this.options.id,
                    layerData: this.options.content[1] || {}
                },'*');
            });
        }
    }
}
</script>

<style>
</style>