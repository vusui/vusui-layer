<!-- 
 * @Name：vusui-layer v1.0 Web弹层组件
 * @Site：http://vusui.com | https://vusui.github.io
 * @Author：林攀 (QQ:45650368)
 * @License：MIT
 * @开发日期：2019-10-30
 * @完成日期：2019-12-04
 * -->
<template>
    <keep-alive>
        <component :options="options" :is="getActiveName"></component>
    </keep-alive>
</template>

<script>
import vusAlert from "./vus-alert.vue";
import vusPage from "./vus-page.vue";
import vusIframe from "./vus-iframe.vue";
import vusloading from "./vus-loading.vue";
import vusTips from "./vus-tips.vue";
import vusMessage from "./vus-message.vue";
import vusNotify from "./vus-notify.vue";
import vusDrawer from "./vus-drawer.vue";
import vusPrompt from "./vus-prompt.vue";
import vusPhotos from "./vus-photos.vue";

export default {
    name: 'vusLayer',
    data() {
        return {
            options: {},
        }
    },
    components: {
        vusAlert,
        vusPage,
        vusIframe,
        vusloading,
        vusTips,
        vusMessage,
        vusNotify,
        vusDrawer,
        vusPrompt,
        vusPhotos
    },
    computed: {
        getActiveName() {
            let comps = [
                'vusAlert',
                'vusPage',
                'vusIframe',
                'vusloading',
                'vusTips',
                'vusMessage',
                'vusNotify',
                'vusDrawer',
                'vusPrompt',
                'vusPhotos'
            ];
            return comps[this.options.type];
        }
    },
    mounted() {
        
    },
    methods: {
    },
    created() {
        
    },
    watch: {
        
    }
}
</script>

<style>
</style>
