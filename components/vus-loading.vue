<!-- 
 * @Name：vusui-layer v1.0 Web弹层组件
 * @Site：http://vusui.com | https://vusui.github.io
 * @Author：林攀 (QQ:45650368)
 * @License：MIT
 * @开发日期：2019-10-30
 * @完成日期：2019-12-04
 * -->
<template>
    <vus-move :options="options" :layer-class="setClass">
        <div class="vus-layer-content">
            <div class="vus-layer-content-scroll vus-layer-padding">
                <template v-if="options.icon!=-1">
                    <div :class="setTypeClass"></div>
                    <div v-if="options.content" class="vus-layer-content-text" v-html="options.content"></div>
                </template>
                <div v-else class="vus-layer-content-text" v-html="options.content||'加载中...'"></div>
            </div>
        </div>
    </vus-move>
</template>

<script>
import vusMove from './vus-move.vue';
export default {
    name: 'vusLoading',
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
            layerClass: 'vus-layer-loading-default',
        }
    },
    components: {
        vusMove
    },
    computed: {
        setClass() {
            let config = this.options;
            let styles = this.layerClass;
            
            if (config.icon != -1) {
                if (config.content) {
                    styles = `${styles} vus-layer-loading-text`;
                }
            } else {
                styles = `${styles} vus-layer-loading-text`;
            }
            return styles;
        },
        setTypeClass() {
            let config = this.options;
            let styles = '';
            if (config.icon != -1) {
                styles = `vus-layer-loading-type${config.icon}`;
                if (config.content) {
                    styles = `${styles} vus-layer-loading-type-white${config.icon}`;
                } else {
                    styles = `${styles} vus-layer-loading-type${config.icon}`;
                }
            }
            return styles;
        }
    }
}
</script>

<style>
</style>
