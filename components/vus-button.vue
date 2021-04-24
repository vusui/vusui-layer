<!-- 
 * @Name：vusui-layer v1.0 Web弹层组件
 * @Site：http://vusui.com | https://vusui.github.io
 * @Author：林攀 (QQ:45650368)
 * @License：MIT
 * @开发日期：2019-10-30
 * @完成日期：2019-12-04
 * -->
<template>
    <div class="vus-layer-button" :class="options.btnAlign?'vus-layer-button-'+options.btnAlign:''">
        <a v-for="(item,index) in button" :key="index" :class="'vus-layer-button-'+index" @click="onclick(index)">{{item}}</a>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'vusButton',
    props: {
        options: {
            type: [String, Object],
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            button: []
        }
    },
    created() {
        let config = this.options;
        if (typeof config.btn === 'string') {
            this.button = [config.btn];
        } else {
            this.button = config.btn;
        }
    },
    methods: {
        onclick(index) {
            this.$emit('click', index);
        }
    }
}
</script>

<style>
</style>
