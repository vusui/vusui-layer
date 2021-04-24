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
            <div class="vus-layer-content-scroll vus-layer-padding" :class="{'vus-layer-icon vus-layer-padding-icon':options.icon!=-1}">
                <div v-if="options.icon!=-1" :class="options.icon!=-1?'icon icon'+options.icon:''"></div>
                <div class="vus-layer-content-text" :class="options.contentAlign?'vus-layer-content-text-'+options.contentAlign:''" v-html="options.content"></div>
            </div>
        </div>
    </vus-move>
</template>

<script>
import vusMove from './vus-move.vue';
export default {
    name: 'vusMessage',
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
            layerClass: 'vus-layer-msg-default',
        }
    },
    components: {
        vusMove
    },
    computed: {
        setClass() {
            let config = this.options;
            let styles = 'vus-layer-msg-status';
            if (config.status == 'success') {
                styles = `${styles} vus-layer-msg-success`;
            } else if (config.status == 'error') {
                styles = `${styles} vus-layer-msg-error`;
            } else if (config.status == 'warning') {
                styles = `${styles} vus-layer-msg-warning`;
            } else if (config.status == 'info') {
                styles = `${styles} vus-layer-msg-info`;
            } else {
                styles = this.layerClass;
            }
            return styles;
        }
    }
}
</script>

<style>
</style>
