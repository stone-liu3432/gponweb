<template>
    <el-form inline :class="['nms-filter-comp', { inline: inline }]" size="small">
        <el-form-item :label="$lang('display_type') + ':'">
            <el-select v-model.number="type">
                <el-option :value="-1" :label="$lang('all')"></el-option>
                <template v-for="item in primary">
                    <el-option :value="item.value" :label="item.label"></el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item v-if="type !== -1">
            <template v-if="proprity.type === 'select' && Array.isArray(proprity.secondaryData)">
                <el-select v-model="filterVal">
                    <template v-for="item in proprity.secondaryData || []">
                        <el-option :value="item.value" :label="item.label"></el-option>
                    </template>
                </el-select>
            </template>
            <template v-else>
                <el-input v-model="filterVal" clearable></el-input>
            </template>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isArray } from "@/utils/common";
export default {
    name: "nmsFilter",
    computed: {
        ...mapGetters(["$lang"])
    },
    props: {
        // data resource
        data: {
            type: Array,
            default: _ => []
        },
        /**
         * {
         *  value: string | number
         *  prop: string
         *  label: string
         *  type: string, secondary form type, options: "select" | "input", default: "input"
         *  secondaryData: secondary data, only used by type="select"
         *  secondaryData: { value, prop, label }
         * }[]
         */
        primary: {
            type: Array
        },
        inline: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            type: -1,
            filterVal: "",
            proprity: {}
        };
    },
    methods: {
        init() {
            this.type = -1;
            this.filterVal = "";
        }
    },
    watch: {
        data() {
            //  数据源更新时，初始化参数
            this.init();
            this.$emit("change", this.data);
        },
        type() {
            if (this.type === -1) return;
            this.proprity = this.primary.filter(
                item => item.value === this.type
            )[0];
            if (this.proprity) {
                if (this.proprity.type === "select") {
                    const prop =
                        this.proprity.secondaryData[0].prop ||
                        this.proprity.secondaryData[0].value;
                    this.filterVal = isDef(prop) ? prop : "";
                } else {
                    this.filterVal = "";
                }
            }
        },
        filterVal() {
            this.$emit(
                "change",
                this.data.filter(item =>
                    this.primary.type === "select"
                        ? item[this.proprity["prop"]] === this.filterVal
                        : String(item[this.proprity["prop"]]).indexOf(
                              this.filterVal
                          ) > -1
                )
            );
        }
    }
};
</script>

<style lang="less" scoped>
.nms-filter-comp {
    margin: 20px 0 20px 0;
    height: 32px;
}
.inline {
    display: inline-block;
    vertical-align: middle;
    margin: 0 20px;
}
</style>