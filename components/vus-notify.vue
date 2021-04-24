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
        <div class="vus-layer-content" :class="setContentClass">
            <div class="vus-layer-content-scroll vus-layer-padding" :class="{'vus-layer-icon':options.icon!=-1}">
                <i v-if="options.icon!=-1" :class="options.icon!=-1?'icon icon'+options.icon:''"></i>
                <div class="vus-layer-content-text" :class="options.contentAlign?'vus-layer-content-text-'+options.contentAlign:''"
                    v-html="options.content"></div>
            </div>
        </div>
    </vus-move>
</template>

<script>
    import vusMove from './vus-move.vue';
    export default {
        name: 'vusNotify',
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
                layerClass: 'vus-layer-notify-rt'
            }
        },
        components: {
            vusMove
        },
        computed: {
            setLayerClass() {
                let styles = this.layerClass,
                    config = this.options;

                if (config.position == 'rt') {
                    styles = 'vus-layer-notify-rt';
                } else if (config.position == 'rb') {
                    styles = 'vus-layer-notify-rb'
                } else if (config.position == 'lb') {
                    styles = 'vus-layer-notify-lb'
                } else if (config.position == 'lt') {
                    styles = 'vus-layer-notify-lt'
                } else {
                    styles = this.layerClass;
                }
                return styles;
            },
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
