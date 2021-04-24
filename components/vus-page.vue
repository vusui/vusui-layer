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
            <div class="vus-layer-content-scroll vus-layer-padding" v-html="options.content"></div>
        </div>
    </vus-move>
</template>

<script>
import vusMove from './vus-move.vue';
export default {
    name: 'vusPage',
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
            layerClass: ''
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
    }
}
</script>

<style>
</style>