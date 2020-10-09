<template>
    <div>
        <page-header type="pon" hasOnu @port-change="portChange">
            <template slot="title">{{ $lang("op_vlan") }}</template>
        </page-header>
        <div style="margin: 12px 0;" v-if="ont_id !== 0xffff">
            <el-button type="primary" size="small" @click="openDialog('add')">{{
                $lang("add")
            }}</el-button>
        </div>
        <template v-if="ont_id !== 0xffff">
            <el-table :data="vlanList.portvlan || []" border>
                <el-table-column
                    :label="$lang('uniport')"
                    prop="uniport"
                ></el-table-column>
                <el-table-column :label="$lang('unitype')">
                    <template slot-scope="scope">{{
                        UNI_TYPES[scope.row.unitype] || ""
                    }}</template>
                </el-table-column>
                <el-table-column :label="$lang('mode')">
                    <template slot-scope="scope">{{
                        VLAN_MODES[scope.row.mode] || ""
                    }}</template>
                </el-table-column>
                <el-table-column
                    :label="$lang('svlanid')"
                    prop="svlanid"
                ></el-table-column>
                <el-table-column :label="$lang('svlanpri')" prop="svlanpri">
                    <template slot-scope="scope">{{
                        scope.row.svlanpri > 7 ? "-" : scope.row.svlanpri
                    }}</template>
                </el-table-column>
                <el-table-column
                    :label="$lang('cvlanid')"
                    prop="cvlanid"
                ></el-table-column>
                <el-table-column :label="$lang('cvlanpri')" prop="cvlanpri">
                    <template slot-scope="scope">{{
                        scope.row.cvlanpri > 7 ? "-" : scope.row.cvlanpri
                    }}</template>
                </el-table-column>
                <el-table-column :label="$lang('config')">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="openDialog('config', scope.row)"
                            >{{ $lang("config") }}</el-button
                        >
                        <el-button
                            type="text"
                            @click="deleteOpvlan(scope.row)"
                            >{{ $lang("delete") }}</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            width="650px"
            destroy-on-close
        >
            <div slot="title">{{ $lang(dialogType) }}</div>
            <op-vlan-form
                ref="op-vlan-form"
                :data="vlanList.portvlan || []"
            ></op-vlan-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button type="primary" @click="submitForm('op-vlan-form')">{{
                    $lang("apply")
                }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef } from "@/utils/common";
import { VLAN_MODES, UNI_TYPES } from "@/utils/commonData";
import opVlanForm from "./opVlan/form";
import postData from "@/mixin/postData";
export default {
    name: "opVlan",
    components: { opVlanForm },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            port_id: 0,
            ont_id: 0xffff,
            vlanList: {},
            UNI_TYPES,
            VLAN_MODES,
            dialogVisible: false,
            dialogType: ""
        };
    },
    methods: {
        getData(port_id, ont_id) {
            this.vlanList = {};
            this.$http
                .get("/gponont_mgmt", {
                    params: {
                        form: "port_vlan",
                        port_id,
                        ont_id
                    }
                })
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.vlanList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        portChange(port_id, ont_id) {
            this.port_id = port_id;
            this.ont_id = ont_id;
            if (ont_id === 0xffff) {
                this.vlanList = {};
                return;
            }
            this.getData(port_id, ont_id);
        },
        openDialog(type, data) {
            this.dialogType = type;
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs["op-vlan-form"].init(type, data);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (formData) {
                    const url = "/gponont_mgmt?form=port_vlan";
                    const post_params = {
                        method: this.dialogType || "set",
                        param: {
                            identifier: (this.port_id << 8) | this.ont_id,
                            ...formData
                        }
                    };
                    this.postData(url, post_params)
                        .then(() => {
                            this.getData(this.port_id, this.ont_id);
                        })
                        .catch(() => {});
                    this.dialogVisible = false;
                }
            });
        },
        deleteOpvlan(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    this.postData("/gponont_mgmt?form=port_vlan", {
                        method: "delete",
                        param: {
                            identifier: (this.port_id << 8) | this.ont_id,
                            uniport: row.uniport,
                            unitype: row.unitype,
                            mode: row.mode,
                            svlanid: row.svlanid,
                            svlanpri: row.svlanpri,
                            cvlanid: row.cvlanid,
                            cvlanpri: row.cvlanpri
                        }
                    })
                        .then(_ => {
                            this.getData(this.port_id, this.ont_id);
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        }
    }
};
</script>

<style lang="less" scoped>
</style>