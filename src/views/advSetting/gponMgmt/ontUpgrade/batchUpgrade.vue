<template>
    <div class="ont-batch-upgrade">
        <div style="margin: 0 0 12px 0">
            <el-button type="primary" size="mini" @click="startUpgrade">
                {{ $lang("start_upgrade") }}
            </el-button>
            <el-button
                type="primary"
                size="mini"
                style="margin-left: 30px"
                @click="cancelUpgrade"
            >
                {{ $lang("cancel_upgrade") }}
            </el-button>
            <el-button
                type="primary"
                size="mini"
                style="margin-left: 30px"
                @click="clearUpgrade"
            >
                {{ $lang("clear_select") }}
            </el-button>
        </div>
        <el-table
            :data="data"
            border
            @selection-change="selectionChange"
            ref="batch-upgrade-ontlist"
        >
            <el-table-column type="selection" :selectable="isDisabledRow">
            </el-table-column>
            <el-table-column :label="$lang('ont_id')" width="80px">
                <template slot-scope="scope">
                    {{
                        `${(scope.row.identifier >> 8) & 0xff} / ${
                            scope.row.identifier & 0xff
                        }`
                    }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$lang('name')"
                prop="name"
            ></el-table-column>
            <el-table-column
                :label="$lang('vendorid')"
                prop="vendorid"
            ></el-table-column>
            <el-table-column
                :label="$lang('ont_version')"
                prop="ont_version"
            ></el-table-column>
            <el-table-column
                :label="$lang('equipmentid')"
                prop="equipmentid"
            ></el-table-column>
            <el-table-column
                :label="$lang('omcc_version')"
                prop="omcc_version"
            ></el-table-column>
            <el-table-column
                :label="$lang('product_code')"
                prop="product_code"
            ></el-table-column>
            <el-table-column
                :label="$lang('mainversion')"
                prop="mainversion"
            ></el-table-column>
            <el-table-column
                :label="$lang('stbversion')"
                prop="stbversion"
            ></el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "batchUpgrade",
    computed: {
        ...mapGetters(["$lang"]),
    },
    props: {
        data: {
            type: Array,
        },
    },
    data() {
        return {
            selections: [],
        };
    },
    methods: {
        selectionChange(selection) {
            this.selections = selection;
        },
        isDisabledRow(row) {
            if (this.selections.length) {
                if (
                    this.selections.some(
                        (item) => item.equipmentid !== row.equipmentid
                    )
                ) {
                    return false;
                }
            }
            return true;
        },
        startUpgrade() {
            if (!this.selections.length) {
                return this.$message.error(this.$lang("no_select_onu"));
            }
            this.$emit(
                "start-upgrade",
                this.selections.map((item) => item.identifier & 0xff)
            );
        },
        cancelUpgrade() {
            if (!this.selections.length) {
                return this.$message.error(this.$lang("no_select_onu"));
            }
            this.$emit(
                "cancel-upgrade",
                this.selections.map((item) => item.identifier & 0xff)
            );
        },
        clearUpgrade() {
            this.$refs["batch-upgrade-ontlist"].clearSelection();
        },
    },
};
</script>

<style lang="less" scoped>
.ont-batch-upgrade /deep/ .el-table__header-wrapper .el-checkbox {
    display: none;
}
</style>