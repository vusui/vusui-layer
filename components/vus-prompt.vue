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
            <div class="vus-layer-content-scroll vus-layer-padding">
                <div class="vus-layer-content-text">
                    <div v-if="options.prompt.title" class="vus-layer-content-title" :style="titleType?options.prompt.title[1]:''" v-html="titleType?options.prompt.title[0]:options.prompt.title"></div>
                    <template v-if="options.prompt.type==2">
                        <textarea class="vus-layer-content-input" v-model="inputValue" :style="{height:options.prompt.height}" :placeholder="options.prompt.placeholder" :minlength="options.prompt.length[0]!=0?options.prompt.length[0]:''" :maxlength="options.prompt.length[1]!=0?options.prompt.length[1]:''"></textarea>
                    </template>
                    <template v-else>
                        <input :type="options.prompt.type==1?'text':'password'" v-model="inputValue" class="vus-layer-content-input" :placeholder="options.prompt.placeholder" :minlength="options.prompt.length[0]!=0?options.prompt.length[0]:''" :maxlength="options.prompt.length[1]!=0?options.prompt.length[1]:''">
                    </template>
                    <div v-if="options.prompt.count&&(options.prompt.length[0]!=0||options.prompt.length[1]!=0)" class="vus-layer-content-input-count">
                        <span v-if="currentLength<options.prompt.length[0]||currentLength==options.prompt.length[1]" class="vus-layer-content-input-count-color">{{currentLength}}</span>
                        <span v-else>{{currentLength}}</span>
                        <span v-if="options.prompt.length[0]&&options.prompt.length[1]">
                            ({{options.prompt.length[0]}}~{{options.prompt.length[1]}})
                        </span>
                        <span v-else-if="options.prompt.length[0]&&!options.prompt.length[1]">
                            ({{options.prompt.length[0]}}~{{'不限制'}})
                        </span>
                        <span v-else-if="!options.prompt.length[0]&&options.prompt.length[1]">
                            / {{options.prompt.length[1]}}
                        </span>
                    </div>
                    <div v-if="options.prompt.content" class="vus-layer-content-content" :style="conType?options.prompt.content[1]:''" v-html="conType?options.prompt.content[0]:options.prompt.content"></div>
                </div>
            </div>
        </div>
    </vus-move>
</template>

<script>
import vusMove from './vus-move.vue';
export default {
    name: 'vusPrompt',
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
            currentLength: 0,
            inputValue: '',
            titleType: false,
            conType: false,
            prompt: {
                type: 1,
                value: '', //输入值
                title: '', //标题 ['标题','font-size:20px;']
                content: '', //内容 ['内容','font-size:20px;']
                height: '', //输入框高度
                regular: '', //正则
                placeholder: '请输入',
                length: [0, 255], //最小长度和最大长度,0为不限制
                count: false, //是否显示计算输入长度
            }
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
        this.options.prompt = Object.assign(this.prompt, this.options.prompt);
        this.titleType = typeof this.options.prompt.title == 'object';
        this.conType = typeof this.options.prompt.content == 'object';
    },
    watch: {
        inputValue(newVal) {
            this.currentLength = newVal.length;
        }
    }
}
</script>

<style>
</style>
