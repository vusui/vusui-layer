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
            <div class="vus-layer-content-scroll vus-layer-padding">
                <div class="vus-layer-content-text" v-html="options.content"></div>
                <i class="vus-layer-tips-arrow"></i>
            </div>
        </div>
    </vus-move>
</template>

<script>
import vusMove from './vus-move.vue';
export default {
    name: 'vusTips',
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
        }
    },
    components: {
        vusMove
    },
    computed: {
        
    }
}
</script>

<style>
</style>
