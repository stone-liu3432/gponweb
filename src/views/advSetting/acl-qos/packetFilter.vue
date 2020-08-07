<template>
    <div>
        <page-header type="none" :title="$lang('packet_filter')">
            <div slot="content">
                <el-button type="primary" size="small" @click="openDialog('add')">{{ $lang('add') }}</el-button>
            </div>
        </page-header>
        <el-table :data="pkts" border>
            <el-table-column label="ACL ID" prop="acl_id" width="100px"></el-table-column>
            <el-table-column label="Rule ID" prop="rule_id" width="100px"></el-table-column>
            <el-table-column :label="$lang('state')" prop="state" width="100px">
                <template slot-scope="scope">{{ scope.row.state ? 'Running' : 'Not running' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('port_list')">
                <template slot-scope="scope">{{ parsePortlist(scope.row.port_list) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('config')" width="120px">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="openDialog('config', scope.row)"
                    >{{ $lang('config') }}</el-button>
                    <el-button type="text" @click="deleteItem(scope.row)">{{ $lang('delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="600px">
            <div slot="title">{{ $lang(dialogType) }}</div>
            <pkt-form ref="pkt-form"></pkt-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('pkt-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, isFunction, parseStringAsList } from "@/utils/common";
import postData from "@/mixin/postData";
import pktForm from "./packetFilterForm/pktForm";
export default {
    name: "packetFilter",
    components: { pktForm },
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang", "getPortName"])
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            pkts: [],
            dialogVisible: false,
            dialogType: ""
        };
    },
    created() {
        this.getPkts();
    },
    methods: {
        getPkts() {
            this.pkts = [];
            this.$http
                .get("/switch_pkfilter")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.pkts = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        parsePortlist(str) {
            return parseStringAsList(str)
                .map(item => this.getPortName(item))
                .join(",");
        },
        openDialog(type, row) {
            this.dialogVisible = true;
            this.dialogType = type;
            this.$nextTick(_ => {
                this.$refs["pkt-form"].init(type, row);
            });
        },
        deleteItem(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    this.postData("/switch_pkfilter?form=inbound", {
                        method: "delete",
                        param: {
                            acl_id: row.acl_id,
                            rule_id: row.rule_id,
                            port_list: row.port_list
                        }
                    })
                        .then(_ => {
                            this.getPkts();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                if (formData) {
                    const url = "/switch_pkfilter?form=inbound",
                        post_params = {
                            method: "set",
                            param: {
                                acl_id: formData.acl_id,
                                rule_id: formData.rule_id,
                                port_list: formData.port_list.join(",")
                            }
                        };
                    this.postData(url, post_params)
                        .then(_ => {
                            this.getPkts();
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