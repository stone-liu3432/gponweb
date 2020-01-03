<template>
    <div>
        <page-header :title="$lang('port_cfg')" type="port" @port-change="portChange"></page-header>
        <el-row :gutter="30">
            <el-col :span="8">
                <el-card shadow="never">
                    <template slot="header">
                        <span>{{ $lang('sw_port_cfg') }}</span>
                        <el-button
                            type="text"
                            style="float: right; padding: 3px 0;"
                            @click="openDialog('sw_port_cfg')"
                        >{{ $lang('config') }}</el-button>
                    </template>
                    <el-form label-width="140px" label-position="left">
                        <el-form-item
                            :label="$lang('admin_status')"
                        >{{ basic.admin_status ? $lang('enable') : $lang('disable') }}</el-form-item>
                        <el-form-item
                            :label="$lang('link_status')"
                        >{{ basic.link_status ? $lang('link_up') : $lang('link_down') }}</el-form-item>
                        <el-form-item
                            :label="$lang('auto_neg')"
                        >{{ basic.auto_neg ? $lang('enable') : $lang('disable') }}</el-form-item>
                        <el-form-item :label="$lang('speed')">{{ basic.speed}}</el-form-item>
                        <el-form-item :label="$lang('duplex')">{{ basic.duplex ? 'full' : 'half' }}</el-form-item>
                        <el-form-item
                            :label="$lang('flow_ctrl')"
                        >{{ basic.flow_ctrl ? $lang('enable') : $lang('disable') }}</el-form-item>
                        <el-form-item :label="$lang('mtu')">{{ basic.mtu }}</el-form-item>
                        <el-form-item :label="$lang('media')">{{ $lang(basic.media) }}</el-form-item>
                        <el-form-item :label="$lang('erate')">{{ basic.erate }}</el-form-item>
                        <el-form-item :label="$lang('irate')">{{ basic.irate }}</el-form-item>
                        <el-form-item :label="$lang('pvid')">{{ basic.pvid }}</el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="never">
                    <template slot="header">
                        <span>{{ $lang('stormctrl') }}</span>
                        <el-button
                            type="text"
                            style="float: right; padding: 3px 0;"
                            @click="openDialog('stormctrl')"
                        >{{ $lang('config') }}</el-button>
                    </template>
                    <el-form label-width="140px" label-position="left">
                        <el-form-item :label="$lang('broadcast')">{{ storm.broadcast }}</el-form-item>
                        <el-form-item :label="$lang('multicast')">{{ storm.multicast }}</el-form-item>
                        <el-form-item :label="$lang('unicast')">{{ storm.unicast }}</el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="never">
                    <template slot="header">
                        <span>{{ $lang('mirror') }}</span>
                        <el-button
                            type="text"
                            style="float: right; padding: 3px 0;"
                            @click="openDialog('mirror')"
                        >{{ $lang('config') }}</el-button>
                    </template>
                    <el-form label-width="140px" label-position="left">
                        <el-form-item
                            :label="$lang('dst_port')"
                        >{{ getPortName(mirror.dst_port) || ' - ' }}</el-form-item>
                        <el-form-item :label="$lang('type')">{{ types[mirror.type] }}</el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <template slot="title">{{ $lang(dialogType) }}</template>
            <port-config-form :type="dialogType" :data="dialogData" ref="port-config-form"></port-config-form>
            <span slot="footer">
                <el-button @click="closeDialog">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('port-config-form')"
                >{{ $lang('apply') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import portConfigForm from "./portConfig/form";
import postData from "@/mixin/postData";
export default {
    name: "portConfig",
    mixins: [postData],
    components: { portConfigForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"])
    },
    data() {
        return {
            port_id: 0,
            types: [" - ", "ingress", "egress", "all"],
            basic: {},
            storm: {},
            mirror: {},
            dialogData: {},
            dialogType: "",
            dialogVisible: false
        };
    },
    inject: ["updateAdvMainScrollbar"],
    mounted() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    created() {},
    methods: {
        ...mapActions(["getPort"]),
        portChange(port_id) {
            this.port_id = port_id;
            this.getBasic(port_id);
            this.getStorm(port_id);
            this.getMirror(port_id);
        },
        getBasic(port_id) {
            this.basic = {};
            this.$http
                .get("/switch_port?form=port_info&port_id=" + port_id)
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.basic = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getStorm(port_id) {
            this.storm = {};
            this.$http
                .get("/switch_port?form=stormctrl&port_id=" + port_id)
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.storm = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getMirror(port_id) {
            this.mirror = {};
            this.$http
                .get("/switch_port?form=mirror&port_id=" + port_id)
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.mirror = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        openDialog(type) {
            const data = {
                sw_port_cfg: this.basic,
                stormctrl: this.storm,
                mirror: this.mirror
            };
            this.dialogData = data[type];
            this.dialogType = type;
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["port-config-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs["port-config-form"].validate(data => {
                if (data) {
                    this.submitAction(data, this.dialogType);
                }
            });
        },
        submitAction(data, type) {
            const ACTIONS = {
                sw_port_cfg(data, type) {
                    const flags = {
                        admin_status: 0x01,
                        auto_neg: 0x02,
                        duplex: 0x04,
                        flow_ctrl: 0x18,
                        speed: 0x40,
                        mtu: 0x80,
                        erate: 0x100,
                        irate: 0x200,
                        pvid: 0x400
                    };
                    const flag = this.computedFlag(flags, data, this.basic);
                    if (flag === 0) {
                        this.$message.error(this.$lang("modify_tips"));
                        return;
                    }
                    return {
                        url: "/switch_port?form=port_info",
                        data: {
                            method: "set",
                            param: {
                                port_id: this.port_id,
                                flags: flag,
                                admin_status: data.admin_status,
                                auto_neg: data.auto_neg,
                                speed: data.speed,
                                duplex: data.duplex,
                                flow_ctrl: data.flow_ctrl,
                                mtu: data.mtu,
                                erate: data.erate,
                                irate: data.irate,
                                pvid: data.pvid
                            }
                        }
                    };
                },
                stormctrl(data, type) {
                    const flags = {
                        broadcast: 0x04,
                        multicast: 0x02,
                        unicast: 0x01
                    };
                    const flag = this.computedFlag(flags, data, this.storm);
                    if (flag === 0) {
                        this.$message.error(this.$lang("modify_tips"));
                        return;
                    }
                    return {
                        url: "/switch_port?form=stormctrl",
                        data: {
                            method: "set",
                            param: {
                                port_id: this.port_id,
                                flags: flag,
                                broadcast: data.broadcast,
                                multicast: data.multicast,
                                unicast: data.unicast
                            }
                        }
                    };
                },
                mirror(data) {
                    return {
                        url: "/switch_port?form=mirror",
                        data: {
                            method: "set",
                            param: {
                                src_port: this.port_id,
                                dst_port: data.dst_port,
                                type: data.type
                            }
                        }
                    };
                }
            };
            if (isFunction(ACTIONS[type])) {
                const result = ACTIONS[type].call(this, data, type);
                if (result) {
                    const { data: post_param, url } = result;
                    console.log("post params -> ", post_param, ",url -> ", url);
                    this.postData(url, post_param)
                        .then(_ => {
                            type === "sw_port_cfg" && this.getBasic();
                            type === "stormctrl" && this.getStorm();
                            type === "mirror" && this.getMirror();
                        })
                        .catch(_ => {});
                }
                this.closeDialog();
            }
        },
        computedFlag(flags, data, baseData) {
            let flag = 0;
            Object.keys(flags).forEach(key => {
                if (data[key] !== baseData[key]) {
                    flag |= flags[key];
                }
            });
            return flag;
        },
        closeDialog() {
            this.dialogVisible = false;
        }
    }
};
</script>

<style lang="less" scoped>
</style>