<template>
    <div>
        <div class="opt-card-title">{{ $lang(title) }}</div>
        <template v-for="(item, key) in data">
            <el-row class="opt-card-row">
                <el-col :span="layout[0]" class="opt-card-col">{{ $lang(key) }}</el-col>
                <el-col :span="layout[1]" class="opt-card-col">{{ item }}</el-col>
            </el-row>
        </template>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "optCard",
    computed: {
        ...mapGetters(["$lang"])
    },
    props: {
        data: {
            type: Object
        },
        title: {
            type: String
        },
        layout: {
            type: Array,
            default: _ => [12, 12]
        }
    },
    data() {
        return {};
    },
    methods: {}
};
</script>

<style lang="less" scoped>
.opt-card-title {
    font-size: 16px;
    font-weight: 500;
    margin: 12px 12px 12px 0;
    color: @titleColor;
}
.opt-card-row {
    border: @border-style;
    border-bottom: none;
    &:last-child {
        border-bottom: @border-style;
    }
}
.opt-card-col {
    padding: 6px 0 6px 12px;
    &:last-child {
        border-left: @border-style;
        min-height: 31px;
    }
}
</style>