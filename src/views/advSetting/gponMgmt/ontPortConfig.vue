<template>
    <div>
        <page-header type="pon" hasOnu @port-change="portChange">
            <template slot="title">{{ $lang('onu_port_cfg') }}</template>
        </page-header>
        <template v-if="ont_id !== 0xffff">
            <el-table :data="portList" border>
                <el-table-column :label="$lang('uniport')" prop="uniport"></el-table-column>
                <el-table-column :label="$lang('unitype')" prop="unitype">
                    <template slot-scope="scope">{{ UNI_TYPES[scope.row.unitype] }}</template>
                </el-table-column>
                <el-table-column :label="$lang('epspeed')">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.epspeed === 0xffff ? 'Auto-neg' : scope.row.epspeed }}</template>
                </el-table-column>
                <el-table-column :label="$lang('epduplex')">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.epduplex ? $lang('half') : $lang('full') }}</template>
                </el-table-column>
                <el-table-column :label="$lang('adminstate')">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.adminstate ? $lang('disable') : $lang('enable') }}</template>
                </el-table-column>
                <el-table-column :label="$lang('epautoneg')">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.epautoneg ? $lang('disable') : $lang('enable') }}</template>
                </el-table-column>
                <el-table-column :label="$lang('flow_ctrl')">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.flow_ctrl ? $lang('disable') : $lang('enable') }}</template>
                </el-table-column>
                <el-table-column :label="$lang('ring')">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.ring === 1 ? $lang('on') : $lang('off') }}</template>
                </el-table-column>
                <el-table-column :label="$lang('na_vlan_id')" prop="na_vlan_id"></el-table-column>
                <el-table-column :label="$lang('na_vlan_pri')" prop="na_vlan_pri"></el-table-column>
                <el-table-column :label="$lang('config')">
                    <template slot-scope="scope">
                        <el-button type="text" @click="openDialog(scope.row)">{{ $lang('config') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <div slot="title">{{ $lang('config') }}</div>
            <ont-port-config-form ref="ont-port-config-form"></ont-port-config-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('ont-port-config-form')"
                >{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, isDef } from "@/utils/common";
import { UNI_TYPES } from "@/utils/commonData";
import ontPortConfigForm from "./ontPortConfig/ontPortConfigForm";
import postData from "@/mixin/postData";
export default {
    name: "ontPortConfig",
    mixins: [postData],
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    components: { ontPortConfigForm },
    computed: {
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            UNI_TYPES,
            port_id: 0,
            ont_id: 0xffff,
            portList: [],
            dialogVisible: false
        };
    },
    methods: {
        getData(port_id, ont_id) {
            this.portList = [];
            this.$http
                .get("/gponont_mgmt", {
                    params: {
                        form: "port_attr",
                        port_id,
                        ont_id
                    }
                })
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.portList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        portChange(port_id, ont_id) {
            this.port_id = port_id;
            this.ont_id = ont_id;
            if (ont_id === 0xffff) {
                this.portList = [];
                return;
            }
            this.getData(port_id, ont_id);
        },
        openDialog(data) {
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs["ont-port-config-form"].init(data);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (isDef(formData)) {
                    const url = "/onumgmt?form=port_attr",
                        post_params = {
                            method: "set",
                            param: formData
                        };
                    this.postData(url, post_params)
                        .then(() => {
                            this.getData(this.port_id, this.ont_id);
                        })
                        .catch(() => {});
                    this.dialogVisible = false;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>