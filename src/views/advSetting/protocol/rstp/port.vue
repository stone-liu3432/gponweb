<template>
    <div>
        <h3>
            {{ $lang('rstp_p_info') }}
            <!-- <el-button
                type="primary"
                style="margin-left: 30px;"
                @click="openDialog"
            >{{ $lang('config') }}</el-button>-->
        </h3>
        <el-table
            border
            stripe
            :data="portData"
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }"
            style="margin-left: 12px;"
        >
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">{{ getPortName(scope.row.port_id) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('port_priority')" prop="port_priority"></el-table-column>
            <el-table-column :label="$lang('port_path_cost')" prop="port_path_cost"></el-table-column>
            <el-table-column :label="$lang('edge_status')">
                <template slot-scope="scope">{{ scope.row.edge_status ? 'Edge' : 'NEdge' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('admin_link_type')" prop="admin_link_type"></el-table-column>
            <el-table-column :label="$lang('oper_link_type')" prop="oper_link_type"></el-table-column>
            <el-table-column :label="$lang('port_role')" prop="port_role"></el-table-column>
            <el-table-column :label="$lang('port_state')" prop="port_state"></el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        style="padding: 3px 0;"
                        @click="openDialog(scope.row)"
                    >{{ $lang('config') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="$lang('config')" :visible.sync="dialogVisible" append-to-body>
            <port-form :form-data="formData" ref="rstp-port-form"></port-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('rstp-port-form')">{{ $lang('apply') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import portForm from "./portForm";
import postData from "@/mixin/postData";
export default {
    name: "rstpPort",
    components: { portForm },
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang", "getPortName"])
    },
    props: {
        portData: {
            type: Array
        }
    },
    data() {
        return {
            dialogVisible: false,
            formData: {}
        };
    },
    methods: {
        openDialog(data) {
            this.formData = data;
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["rstp-port-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(data => {
                if (data) {
                    const post_params = this.composeData(data);
                    if (post_params) {
                        this.postData("/switch_rstp?form=port", post_params)
                            .then(_ => {
                                this.$emit("refresh");
                            })
                            .catch(_ => {});
                    }
                    this.dialogVisible = false;
                }
            });
        },
        composeData(data) {
            const flags = {
                port_path_cost: 0x02,
                port_priority: 0x04,
                admin_link_type: 0x08,
                edge_status: 0x10
            };
            let flag = 0;
            Object.keys(data).forEach(key => {
                if (key !== "port_id" && data[key] !== this.formData[key]) {
                    flag |= flags[key];
                }
            });
            if (flag === 0) {
                this.$message.warning(this.$lang("modify_tips"));
                return;
            }
            return {
                method: "set",
                param: {
                    flags: flag,
                    port_id: data.port_id,
                    port_priority: data.port_priority,
                    port_path_cost: data.port_path_cost,
                    edge_status: data.edge_status,
                    admin_link_type: data.admin_link_type
                }
            };
        }
    }
};
</script>

<style lang="less" scoped>
h3 {
    color: @titleColor;
}
</style>