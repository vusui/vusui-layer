<!-- 
 * @Name：vusui-layer v1.0 Web弹层组件
 * @Site：http://vusui.com | https://vusui.github.io
 * @Author：林攀 (QQ:45650368)
 * @License：MIT
 * @开发日期：2019-10-30
 * @完成日期：2019-12-04
 * -->
<template>
    <vus-move :options="options" :layer-class="setLayerClass">
        <div class="vus-layer-content">
            <div class="vus-layer-content-scroll">
                <div v-if="options.content&&options.content.component" class="vus-layer-content-drawer" :id="id"></div>
                <div v-else v-html="options.content"></div>
            </div>
        </div>
    </vus-move>
</template>

<script>
import vusMove from './vus-move.vue';
import Util from '../common/util.js';
export default {
    name: 'vusDrawer',
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
            id: "vusui-layer-drawer-" + new Date().getTime(),
            layerClass: 'vus-layer-drawer-position',
            content: ''
        }
    },
    components: {
        vusMove
    },
    computed: {
        setLayerClass() {
            let styles = this.layerClass,
                config = this.options;
            
            if (config.position == 'right') {
                styles = `${styles} vus-layer-drawer-right`;
            } else if (config.position == 'bottom') {
                styles = `${styles} vus-layer-drawer-bottom`;
            } else if (config.position == 'left') {
                styles = `${styles} vus-layer-drawer-left`;
            } else if (config.position == 'top') {
                styles = `${styles} vus-layer-drawer-top`;
            }
            return styles;
        }
    },
    mounted() {
        if (this.options.content && this.options.content.component) {
            this.getContent();
        }
    },
    methods: {
        async getContent() {
            await Util.sleep(10);
            let config = this.options;
            let drawerID = Util.$('#' + this.id);
            let propsData = Util.deepClone(config.content.data) || {};
            propsData['layerID'] = config.id;
            propsData['layerData'] = config.content.data;
            let instance = new config.content.component({
                //具体参数信息，请参考vue源码
                parent: config.content.parent,
                propsData: propsData
            });
            drawerID.appendChild(instance.$mount().$el);
            config.vusui.instancesVue[config.id].drawer = instance.$mount();
        }
    }
}
</script>

<style>
</style>
