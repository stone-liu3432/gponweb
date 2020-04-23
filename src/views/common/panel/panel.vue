<template>
    <div :class="['nms-panel' ,{ 'has-border': border }]">
        <h3>
            <slot name="title">{{ title }}</slot>
        </h3>
        <template v-for="(item, key) in data">
            <template v-if="!excludes.includes(key)">
                <el-row class="nms-panel-row">
                    <el-col :span="layout[0]" class="nms-panel-title">{{ renderTitle(key) }}:</el-col>
                    <el-col
                        :span="layout[1]"
                        class="nms-panel-content"
                    >{{ renderContent(key, item) }}</el-col>
                </el-row>
            </template>
        </template>
    </div>
</template>

<script>
import { isArray, isDef, isFunction } from "@/utils/common";
import { mapGetters } from "vuex";
export default {
    name: "dataPanel",
    computed: {
        ...mapGetters(["$lang"])
    },
    props: {
        data: {
            type: Object
        },
        layout: {
            type: Array,
            default: _ => [12, 12],
            validator: val =>
                isArray(val) && val.every(item => typeof item === "number")
        },
        title: {
            type: String
        },
        border: {
            type: Boolean,
            default: false
        },
        excludes: {
            type: Array,
            default: _ => []
        },
        contentRender: {
            type: Object,
            default: _ => ({})
        },
        titleRender: {
            type: Object,
            default: _ => ({})
        }
    },
    data() {
        return {};
    },
    methods: {
        renderTitle(key) {
            return isDef(this.titleRender[key])
                ? isFunction(this.titleRender[key])
                    ? this.titleRender[key].call(this, key)
                    : this.titleRender[key]
                : this.$lang(key);
        },
        renderContent(key, val) {
            return isDef(this.contentRender[key])
                ? isFunction(this.contentRender[key])
                    ? this.contentRender[key].call(this, key, val)
                    : this.contentRender[key]
                : val;
        }
    }
};
</script>

<style lang="less" scoped>
.nms-panel {
    padding: 0 12px 12px 12px;
}
.has-border {
    border: @border-style;
    border-radius: 3px;
    .nms-panel-row {
        border-top: @border-style;
    }
}
h3 {
    color: @titleColor;
}
.nms-panel-row {
    .base-font-style;
    padding: 6px 0;
    .nms-panel-title {
        padding-left: 12px;
    }
    .nms-panel-content {
        overflow: hidden;
        word-wrap: break-word;
        word-break: break-all;
    }
}
</style>