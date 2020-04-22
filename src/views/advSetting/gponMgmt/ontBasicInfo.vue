<template>
    <div>
        <page-header type="pon" hasOnu @port-change="portChange">
            <template slot="title">{{ $lang('onu_basic_info') }}</template>
        </page-header>
        <template v-if="ont_id !== 0xffff">
            <div style="margin: 12px 0;">
                <el-button
                    type="primary"
                    size="mini"
                    @click="changeState"
                >{{ $lang('switch', 'ont','state') }}</el-button>
                <el-button
                    type="primary"
                    size="mini"
                    style="margin-left: 30px;"
                    @click="reboot"
                >{{ $lang('reboot', 'ont') }}</el-button>
                <el-button
                    type="primary"
                    size="mini"
                    style="margin-left: 30px;"
                    @click="setInfo"
                >{{ $lang('config', 'desc') }}</el-button>
            </div>
            <el-row :gutter="30">
                <el-col :span="12">
                    <nms-panel
                        :data="baseInfo"
                        :excludes="['identifier']"
                        :contentRender="contentRender"
                        border
                        v-if="Object.keys(baseInfo).length"
                    >
                        <span slot="title">{{ $lang('ont', 'basic', 'info') }}</span>
                    </nms-panel>
                </el-col>
                <el-col :span="12">
                    <div>
                        <nms-panel
                            :data="versionInfo"
                            :excludes="['identifier']"
                            border
                            v-if="Object.keys(versionInfo).length"
                        >
                            <span slot="title">{{ $lang('version', 'info') }}</span>
                        </nms-panel>
                    </div>
                    <div style="margin-top: 30px;">
                        <nms-panel
                            :data="portInfo"
                            :excludes="['identifier']"
                            border
                            v-if="Object.keys(portInfo).length"
                        >
                            <span slot="title">{{ $lang('port', 'info') }}</span>
                        </nms-panel>
                    </div>
                </el-col>
            </el-row>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <span slot="title">{{ $lang(('config')) }}</span>
            <ont-basic-form ref="ont-basic-info"></ont-basic-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('ont-basic-info')">{{ $lang('apply') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef } from "@/utils/common";
import { ONT_AUTH_MODES } from "@/utils/commonData";
import ontBasicForm from "./ontBasicInfo/ontBasicForm";
import postData from "@/mixin/postData";
import rebootOnt from "@/mixin/onu/rebootOnt";
export default {
    name: "ontBasicInfo",
    components: { ontBasicForm },
    computed: {
        ...mapGetters(["$lang"])
    },
    mixins: [postData, rebootOnt],
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            port_id: 0,
            ont_id: 0xffff,
            baseInfo: {},
            portInfo: {},
            versionInfo: {},
            contentRender: {
                auth_mode(key, val) {
                    return ONT_AUTH_MODES[val];
                }
            },
            dialogVisible: false
        };
    },
    methods: {
        getBaseInfo(port_id, ont_id) {
            this.$http
                .get("/gponont_mgmt", {
                    params: {
                        form: "base",
                        port_id,
                        ont_id
                    }
                })
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.baseInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getPortInfo(port_id, ont_id) {
            this.$http
                .get("/gponont_mgmt", {
                    params: {
                        form: "capability",
                        port_id,
                        ont_id
                    }
                })
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.portInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getVersionInfo(port_id, ont_id) {
            this.$http
                .get("/gponont_mgmt", {
                    params: {
                        form: "ont_version",
                        port_id,
                        ont_id
                    }
                })
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.versionInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        portChange(port_id, ont_id) {
            this.port_id = port_id;
            this.ont_id = ont_id;
            if (ont_id === 0xffff) {
                this.baseInfo = {};
                this.portInfo = {};
                this.versionInfo = {};
                return;
            }
            this.getBaseInfo(port_id, ont_id);
            this.getPortInfo(port_id, ont_id);
            this.getVersionInfo(port_id, ont_id);
        },
        reboot() {
            this.rebootOnt(this.baseInfo.identifier)
                .then(res => {
                    this.getBaseInfo(this.port_id, this.ont_id);
                })
                .catch(err => {});
        },
        changeState() {
            const flag = /^active$/i.test(this.baseInfo.state);
            this.$confirm(
                flag
                    ? this.$lang("tips_deactive_state")
                    : this.$lang("tips_active_state")
            )
                .then(_ => {
                    const flags = flag ? 0x2 : 0x1;
                    const post_params = {
                        method: "set",
                        param: {
                            identifier: this.baseInfo.identifier,
                            flags,
                            ont_name: "",
                            ont_description: ""
                        }
                    };
                    this.postData("/gponont_mgmt?form=info", post_params)
                        .then(_ => {
                            this.getBaseInfo(this.port_id, this.ont_id);
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        setInfo() {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["ont-basic-info"].init(this.baseInfo);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(result => {
                if (result) {
                    const { ont_name, ont_description } = result;
                    if (
                        ont_name === this.baseInfo.ont_name &&
                        ont_description === this.baseInfo.ont_description
                    ) {
                        this.dialogVisible = false;
                        return this.$message.info(this.$lang("modify_tips"));
                    }
                    const data = {
                        method: "set",
                        param: result
                    };
                    this.postData("/gponont_mgmt?form=info", data)
                        .then(_ => {
                            this.getBaseInfo(this.port_id, this.ont_id);
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