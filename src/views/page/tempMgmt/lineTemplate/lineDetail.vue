<template>
    <div>
        <el-row style="margin: 0 10px 20px 10px;">
            <el-col :span="12">
                <span class="line-detail-title">{{ $lang('profname') }}:</span>
                <span>{{ data.profname }}</span>
            </el-col>
            <el-col :span="12">
                <span class="line-detail-title">{{ $lang('profid') }}:</span>
                <span>{{ data.profid }}</span>
            </el-col>
        </el-row>
        <el-row style="margin: 0 10px 20px 10px;">
            <el-col :span="12">
                <span class="line-detail-title">{{ $lang('type') }}:</span>
                <span>{{ types[data.type] }}</span>
            </el-col>
            <el-col :span="12">
                <span class="line-detail-title">{{ $lang('mappingmode') }}:</span>
                <span>{{ mappingModes[data.mappingmode] }}</span>
            </el-col>
        </el-row>
        <el-row style="margin: 0 10px 20px 10px;">
            <el-col :span="12">
                <span
                    class="line-detail-title"
                    style="margin-right: 20px;"
                >{{ $lang('pagination_display') }}</span>
                <el-switch v-model="showPagination" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-col>
            <el-col :span="12">
                <el-button
                    type="primary"
                    size="mini"
                    @click="setProfile(data)"
                >{{ $lang('config') }}</el-button>
            </el-col>
        </el-row>
        <template v-if="showPagination">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane :label="$lang('tcont')" name="tcont">
                    <line-tcont-table :data="tcont"></line-tcont-table>
                </el-tab-pane>
                <el-tab-pane :label="$lang('gem')" name="gem">
                    <line-gem-table :data="gem"></line-gem-table>
                </el-tab-pane>
            </el-tabs>
        </template>
        <template v-else>
            <h3>{{ $lang('tcont') }}</h3>
            <line-tcont-table :data="tcont"></line-tcont-table>
            <h3>{{ $lang('gem') }}</h3>
            <line-gem-table :data="gem"></line-gem-table>
        </template>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import lineTcontTable from "./lineTcontTable";
import lineGemTable from "./lineGemTable";
export default {
    name: "lineDetail",
    components: { lineGemTable, lineTcontTable },
    computed: {
        ...mapGetters(["$lang"]),
        tcont() {
            return this.data.tcont || [];
        },
        gem() {
            return this.data.gem || [];
        }
    },
    props: {
        data: {
            type: Object
        }
    },
    data() {
        return {
            showPagination: false,
            activeName: "tcont",
            types: { 1: "EPON", 2: "GPON" },
            mappingModes: { 1: "VLAN", 2: "Priority", 3: "TCI" }
        };
    },
    methods: {
        setProfile(data) {
            this.$emit("set-profile", data);
        }
    },
    watch: {
        showPagination() {
            if (!this.showPagination) {
                this.activeName = "tcont";
            }
        }
    }
};
</script>

<style lang="less" scoped>
span + span {
    margin-left: 20px;
    color: @titleColor;
}
.line-detail-title {
    font-weight: bold;
    font-size: 12px;
    color: #909399;
}
</style>
