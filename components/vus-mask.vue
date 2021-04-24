<!-- 
 * @Name：vusui-layer v1.0 Web弹层组件
 * @Site：http://vusui.com | https://vusui.github.io
 * @Author：林攀 (QQ:45650368)
 * @License：MIT
 * @开发日期：2019-10-30
 * @完成日期：2019-12-04
 * -->
<template>
    <div class="vus-layer-mask" :id="options.id+'-mask'" :style="setStyle" @click="close"></div>
</template>

<script>
import Util from '../common/util.js';
export default {
    name: 'vusMask',
    data() {
        return {
            options: {}
        }
    },
    computed: {
        setStyle() {
            return `z-index:${this.options.zIndex - 1};background-color:${this.options.shade[1] || '#000'};opacity:${this.options.shade[0] || this.options.shade}`;
        }
    },
    methods: {
        close(e) {
            if (this.options.shadeClose) {
                Util.maskClose(e, this.options);
            }
        }
    }
}
</script>
