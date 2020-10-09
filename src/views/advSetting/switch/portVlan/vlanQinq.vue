<template>
    <div>
        <el-table
            border
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }"
            style="width: 700px;"
            :data="baseData"
        >
            <el-table-column label="CVLAN">
                <template slot-scope="scope">{{
                    scope.row.cvlan || "-"
                }}</template>
            </el-table-column>
            <el-table-column label="CVLAN Start">
                <template slot-scope="scope">{{
                    scope.row.cvlan_s || "-"
                }}</template>
            </el-table-column>
            <el-table-column label="CVLAN End">
                <template slot-scope="scope">{{
                    scope.row.cvlan_e || "-"
                }}</template>
            </el-table-column>
            <el-table-column label="SVLAN" prop="svlan"></el-table-column>
            <el-table-column :label="$lang('svlan_pri')">
                <template slot-scope="scope">{{
                    scope.row.svlan_pri === 255 ? "-" : scope.row.svlan_pri
                }}</template>
            </el-table-column>
            <el-table-column>
                <template slot="header">
                    <el-button @click="addQinq">{{ $lang("add") }}</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        style="padding: 3px 0;"
                        @click="deleteQinq(scope.row)"
                        >{{ $lang("delete") }}</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :title="$lang('add')"
            :visible.sync="dialogVisible"
            append-to-body
        >
            <vlan-qinq-form ref="port-vlan-qinq-form"></vlan-qinq-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('port-vlan-qinq-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import postData from "@/mixin/postData";
import vlanQinqForm from "./vlanQinqForm";
export default {
    name: "vlanQinq",
    components: { vlanQinqForm },
    mixins: [postData],
    props: {
        baseData: {
            type: Array,
            required: true
        },
        port_id: {
            type: Number,
            required: true
        }
    },
    computed: {
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            dialogVisible: false
        };
    },
    created() {},
    methods: {
        addQinq() {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["port-vlan-qinq-form"].init();
            });
        },
        deleteQinq(data) {
            this.$confirm(this.$lang("if_sure", "delete") + "?")
                .then(_ => {
                    const post_params = {
                        method: "delete",
                        param: {
                            port_id: data.port_id,
                            cvlan: data.cvlan,
                            cvlan_s: data.cvlan_s,
                            cvlan_e: data.cvlan_e,
                            action: 1
                        }
                    };
                    this.postData("/vlan_action?form=qinq", post_params)
                        .then(_ => {
                            this.$emit("refresh", this.port_id);
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        submitForm(formName) {
            this.$refs[formName].validate(data => {
                if (data) {
                    const post_params = {
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            cvlan: data.cvlan,
                            cvlan_s: data.cvlan_s,
                            cvlan_e: data.cvlan_e,
                            svlan: data.svlan,
                            svlan_pri: data.svlan_pri,
                            action: 1
                        }
                    };
                    this.postData("/vlan_action?form=qinq", post_params)
                        .then(_ => {
                            this.$emit("refresh", this.port_id);
                        })
                        .catch(_ => {});
                    this.dialogVisible = false;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>