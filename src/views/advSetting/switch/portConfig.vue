<template>
    <div>
        <page-header
            :title="$lang('port_cfg')"
            type="port"
            :portid="port_id"
            @port-change="portChange"
        ></page-header>
        <el-row :gutter="30" style="overflow: hidden">
            <el-col :span="8">
                <el-card shadow="never">
                    <template slot="header">
                        <span>{{ $lang("port_cfg") }}</span>
                        <el-button
                            type="text"
                            style="float: right; padding: 3px 0"
                            @click="openDialog('sw_port_cfg')"
                            >{{ $lang("config") }}</el-button
                        >
                    </template>
                    <el-form label-width="140px" label-position="left">
                        <el-form-item :label="$lang('admin_status') + ':'">{{
                            basic.admin_status
                                ? $lang("enable")
                                : $lang("disable")
                        }}</el-form-item>
                        <el-form-item :label="$lang('link_status') + ':'">{{
                            basic.link_status
                                ? $lang("link_up")
                                : $lang("link_down")
                        }}</el-form-item>
                        <el-form-item :label="$lang('auto_neg') + ':'">{{
                            basic.auto_neg ? $lang("enable") : $lang("disable")
                        }}</el-form-item>
                        <el-form-item :label="$lang('speed') + ':'">{{
                            basic.speed
                        }}</el-form-item>
                        <el-form-item :label="$lang('duplex') + ':'">{{
                            basic.duplex ? "full" : "half"
                        }}</el-form-item>
                        <el-form-item :label="$lang('flow_ctrl') + ':'">{{
                            basic.flow_ctrl ? $lang("enable") : $lang("disable")
                        }}</el-form-item>
                        <el-form-item :label="$lang('mtu') + ':'">{{
                            basic.mtu
                        }}</el-form-item>
                        <el-form-item :label="$lang('media') + ':'">{{
                            $lang(basic.media)
                        }}</el-form-item>
                        <template v-if="port_id > system.ponports">
                            <el-form-item :label="$lang('erate') + ':'">{{
                                basic.erate
                            }}</el-form-item>
                            <el-form-item :label="$lang('irate') + ':'">{{
                                basic.irate
                            }}</el-form-item>
                        </template>
                        <el-form-item :label="$lang('pvid') + ':'">{{
                            basic.pvid
                        }}</el-form-item>
                        <el-form-item :label="$lang('port_desc') + ':'">
                            <div
                                style="
                                    word-wrap: break-word;
                                    word-break: break-all;
                                "
                            >
                                {{ basic.port_desc }}
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="never">
                    <template slot="header">
                        <span>{{ $lang("stormctrl") }}</span>
                        <el-button
                            type="text"
                            style="float: right; padding: 3px 0"
                            @click="openDialog('stormctrl')"
                            >{{ $lang("config") }}</el-button
                        >
                    </template>
                    <el-form label-width="140px" label-position="left">
                        <el-form-item :label="$lang('broadcast') + ':'">{{
                            storm.broadcast
                        }}</el-form-item>
                        <el-form-item :label="$lang('multicast') + ':'">{{
                            storm.multicast
                        }}</el-form-item>
                        <el-form-item :label="$lang('unicast') + ':'">{{
                            storm.unicast
                        }}</el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="never">
                    <template slot="header">
                        <span>{{ $lang("mirror") }}</span>
                        <el-button
                            type="text"
                            style="float: right; padding: 3px 0"
                            @click="flushMirror"
                            >{{ $lang("flush") }}</el-button
                        >
                        <el-button
                            type="text"
                            style="
                                float: right;
                                padding: 3px 0;
                                margin-right: 20px;
                            "
                            @click="openDialog('mirror')"
                            >{{ $lang("config") }}</el-button
                        >
                    </template>
                    <el-form label-width="140px" label-position="left">
                        <el-form-item :label="$lang('dst_port') + ':'">{{
                            getPortName(mirror.dst_port) || " - "
                        }}</el-form-item>
                        <el-form-item :label="$lang('type') + ':'">{{
                            types[mirror.type]
                        }}</el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="600px">
            <template slot="title">{{ $lang(dialogType) }}</template>
            <port-config-form
                :type="dialogType"
                :port_id="port_id"
                :data="dialogData"
                ref="port-config-form"
            ></port-config-form>
            <span slot="footer">
                <el-button @click="closeDialog">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('port-config-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { isDef, isFunction } from "@/utils/common";
import portConfigForm from "./portConfig/form";
import postData from "@/mixin/postData";
export default {
    name: "portConfig",
    mixins: [postData],
    components: { portConfigForm },
    computed: {
        ...mapState(["system"]),
        ...mapGetters(["$lang", "getPortName"]),
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
            dialogVisible: false,
        };
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(() => {
            this.updateAdvMainScrollbar();
        });
    },
    created() {
        const portid = this.$route.query.port_id;
        if (portid) {
            this.port_id = Number(portid) || 0;
        }
    },
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
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.basic = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getStorm(port_id) {
            this.storm = {};
            this.$http
                .get("/switch_port?form=stormctrl&port_id=" + port_id)
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.storm = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getMirror(port_id) {
            this.mirror = {};
            this.$http
                .get("/switch_port?form=mirror&port_id=" + port_id)
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.mirror = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        openDialog(type) {
            const data = {
                sw_port_cfg: this.basic,
                stormctrl: this.storm,
                mirror: this.mirror,
            };
            this.dialogData = data[type];
            this.dialogType = type;
            this.dialogVisible = true;
            this.$nextTick((_) => {
                this.$refs["port-config-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs["port-config-form"].validate((data) => {
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
                        pvid: 0x400,
                        port_desc: 0x800,
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
                                pvid: data.pvid,
                                port_desc: data.port_desc,
                            },
                        },
                    };
                },
                stormctrl(data, type) {
                    const flags = {
                        broadcast: 0x04,
                        multicast: 0x02,
                        unicast: 0x01,
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
                                unicast: data.unicast,
                            },
                        },
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
                                type: data.type,
                            },
                        },
                    };
                },
            };
            if (isFunction(ACTIONS[type])) {
                const result = ACTIONS[type].call(this, data, type);
                if (result) {
                    const { data: post_param, url } = result;
                    this.postData(url, post_param)
                        .then((_) => {
                            type === "sw_port_cfg" &&
                                this.getBasic(this.port_id);
                            type === "stormctrl" && this.getStorm(this.port_id);
                            type === "mirror" && this.getMirror(this.port_id);
                        })
                        .catch((_) => {});
                    this.closeDialog();
                }
            }
        },
        computedFlag(flags, data, baseData) {
            let flag = 0;
            Object.keys(flags).forEach((key) => {
                if (
                    key === "speed" &&
                    baseData.auto_neg &&
                    data.speed !== "auto"
                ) {
                    flag |= flags[key];
                    return;
                }
                if (data[key] !== baseData[key]) {
                    flag |= flags[key];
                }
            });
            return flag;
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        flushMirror() {
            this.$confirm(this.$lang("if_sure", "flush", "mirror") + " ?")
                .then((_) => {
                    this.postData("/switch_port?form=mirror", {
                        method: "clear",
                        param: {
                            src_port: this.port_id,
                        },
                    })
                        .then((_) => {
                            this.getMirror(this.port_id);
                        })
                        .catch((_) => {});
                })
                .catch((_) => {});
        },
    },
};
</script>

<style lang="less" scoped>
</style>