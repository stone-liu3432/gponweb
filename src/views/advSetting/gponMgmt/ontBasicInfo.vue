<template>
    <div>
        <page-header
            type="pon"
            :portid="pid"
            :onuid="oid"
            hasOnu
            @port-change="portChange"
        >
            <template slot="title">{{ $lang("onu_basic_info") }}</template>
            <template slot="content">
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px"
                    @click="refreshData"
                >
                    {{ $lang("refresh") }}
                </el-button>
            </template>
        </page-header>
        <el-tabs v-model="activeName" type="card" v-if="ont_id !== 0xffff">
            <el-tab-pane :label="$lang('onu_basic_info')" name="basic_info">
                <div style="margin: 12px 0">
                    <el-button type="primary" size="small" @click="changeState">
                        {{ $lang("switch", "ont", "state") }}
                    </el-button>
                    <el-button
                        type="primary"
                        size="small"
                        style="margin-left: 30px"
                        @click="reboot"
                    >
                        {{ $lang("reboot", "ont") }}
                    </el-button>
                    <el-button
                        type="primary"
                        size="small"
                        style="margin-left: 30px"
                        @click="setInfo"
                    >
                        {{ $lang("config", "desc") }}
                    </el-button>
                </div>
                <el-row :gutter="30" style="width: 1030px">
                    <el-col :span="12">
                        <nms-panel
                            :data="baseInfo"
                            :excludes="['identifier']"
                            :contentRender="contentRender"
                            border
                            v-if="Object.keys(baseInfo).length"
                        >
                            <span slot="title">
                                {{ $lang("ont", "basic", "info") }}
                            </span>
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
                                <span slot="title">
                                    {{ $lang("version", "info") }}
                                </span>
                            </nms-panel>
                        </div>
                        <div style="margin-top: 30px">
                            <nms-panel
                                :data="portInfo"
                                :excludes="['identifier']"
                                border
                                :contentRender="contentRender"
                                v-if="Object.keys(portInfo).length"
                            >
                                <span slot="title">
                                    {{ $lang("port", "info") }}
                                </span>
                            </nms-panel>
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane :label="$lang('onu_optical_diagnose')" name="optical">
                <ont-optical :data="opticalInfo"></ont-optical>
            </el-tab-pane>
            <el-tab-pane :label="$lang('onu_alarm')" name="alarm">
                <ont-alarm :data="alarmList"></ont-alarm>
            </el-tab-pane>
            <el-tab-pane :label="$lang('ont_ipconfig')" name="ipconfig">
                <ont-ipconfig
                    :data="ontIpconfig"
                    @refresh-data="getData"
                    :identifier="identifier"
                ></ont-ipconfig>
            </el-tab-pane>
            <el-tab-pane :label="$lang('wan_connect')" name="wan_connect">
                <template v-if="portInfo.wan">
                    <ont-wan
                        :data="wanConnect"
                        :port-info="portInfo"
                        :identifier="identifier"
                        @refresh-data="getData"
                    ></ont-wan>
                </template>
                <template v-else>
                    <span class="function-not-support">
                        {{ $lang("wan_not_support") }}
                    </span>
                </template>
            </el-tab-pane>
            <el-tab-pane :label="$lang('wlan')" name="wlan">
                <template v-if="portInfo.wlan || portInfo.wlan5g">
                    <ont-wlan
                        :data="wlanInfo"
                        :identifier="identifier"
                        @refresh-data="getData"
                    ></ont-wlan>
                </template>
                <template v-else>
                    <span class="function-not-support">
                        {{ $lang("wlan_not_support") }}
                    </span>
                </template>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <span slot="title">{{ $lang("config") }}</span>
            <ont-basic-form ref="ont-basic-info"></ont-basic-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">
                    {{ $lang("cancel") }}
                </el-button>
                <el-button type="primary" @click="submitForm('ont-basic-info')">
                    {{ $lang("apply") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isUndef, isArray, debounce } from "@/utils/common";
import {
    ONT_AUTH_MODES,
    ONT_STATES,
    ONT_RSTATES,
    ONT_MSTATES,
    ONT_CSTATES,
} from "@/utils/commonData";
import ontBasicForm from "./ontBasicInfo/ontBasicForm";
import ontOptical from "./ontBasicInfo/ontOptical";
import ontAlarm from "./ontBasicInfo/ontAlarm";
import ontIpconfig from "./ontBasicInfo/ontIpconfig";
import postData from "@/mixin/postData";
import rebootOnt from "@/mixin/onu/rebootOnt";
import ontWan from "./ontBasicInfo/ontWan";
import ontWlan from "./ontBasicInfo/ontWlan";
export default {
    name: "ontBasicInfo",
    components: {
        ontBasicForm,
        ontAlarm,
        ontOptical,
        ontIpconfig,
        ontWan,
        ontWlan,
    },
    computed: {
        ...mapGetters(["$lang"]),
        identifier() {
            return (this.port_id << 8) | this.ont_id;
        },
    },
    mixins: [postData, rebootOnt],
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(() => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            pid: 0,
            oid: 0xffff,
            port_id: 0,
            ont_id: 0xffff,
            baseInfo: {},
            portInfo: {},
            versionInfo: {},
            contentRender: {
                auth_mode(key, val) {
                    return ONT_AUTH_MODES[val];
                },
                iphost_num(key, val) {
                    return val
                        ? this.$lang("support")
                        : this.$lang("not_support");
                },
                veip_num(key, val) {
                    return val
                        ? this.$lang("support")
                        : this.$lang("not_support");
                },
                state(key, val) {
                    return ONT_STATES[val];
                },
                rstate(key, val) {
                    return ONT_RSTATES[val];
                },
                cstate(key, val) {
                    return ONT_CSTATES[val];
                },
                mstate(key, val) {
                    return ONT_MSTATES[val];
                },
                wan(key, val) {
                    return val > 0
                        ? this.$lang("support")
                        : this.$lang("not_support");
                },
                wlan(key, val) {
                    return val > 0
                        ? this.$lang("support")
                        : this.$lang("not_support");
                },
                wlan5g(key, val) {
                    return val > 0
                        ? this.$lang("support")
                        : this.$lang("not_support");
                },
            },
            dialogVisible: false,
            activeName: "basic_info",
            opticalInfo: {},
            alarmList: [],
            ontIpconfig: [],
            wanConnect: [],
            wlanInfo: {},
        };
    },
    created() {
        const port_id =
                this.$route.query.port_id ||
                sessionStorage.getItem("port_id") ||
                0,
            ont_id =
                this.$route.query.ont_id ||
                sessionStorage.getItem("ont_id") ||
                0xffff;
        this.pid = Number(port_id);
        this.oid = Number(ont_id);
    },
    methods: {
        getBaseInfo(port_id, ont_id) {
            this.$http
                .get("/gponont_mgmt", {
                    params: {
                        form: "base",
                        port_id,
                        ont_id,
                    },
                })
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.baseInfo = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getPortInfo(port_id, ont_id) {
            this.$http
                .get("/gponont_mgmt", {
                    params: {
                        form: "capability",
                        port_id,
                        ont_id,
                    },
                })
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.portInfo = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getVersionInfo(port_id, ont_id) {
            this.$http
                .get("/gponont_mgmt", {
                    params: {
                        form: "ont_version",
                        port_id,
                        ont_id,
                    },
                })
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.versionInfo = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        portChange(port_id, ont_id) {
            this.port_id = port_id;
            this.ont_id = ont_id;
            sessionStorage.setItem("port_id", port_id);
            sessionStorage.setItem("ont_id", ont_id);
            if (ont_id === 0xffff) {
                this.baseInfo = {};
                this.portInfo = {};
                this.versionInfo = {};
                return;
            }
            this.pid = 0;
            this.oid = 0xffff;
            this.getData();
        },
        reboot() {
            this.rebootOnt(this.baseInfo.identifier)
                .then((res) => {
                    this.getBaseInfo(this.port_id, this.ont_id);
                })
                .catch((err) => {});
        },
        changeState() {
            const flag = this.baseInfo.state;
            this.$confirm(
                flag
                    ? this.$lang("tips_deactive_state")
                    : this.$lang("tips_active_state")
            )
                .then(() => {
                    const flags = flag ? 0x2 : 0x1;
                    const post_params = {
                        method: "set",
                        param: {
                            identifier: this.baseInfo.identifier,
                            flags,
                            ont_name: "",
                            ont_description: "",
                        },
                    };
                    this.postData("/gponont_mgmt?form=info", post_params)
                        .then(() => {
                            this.getBaseInfo(this.port_id, this.ont_id);
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        setInfo() {
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs["ont-basic-info"].init(this.baseInfo);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((result) => {
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
                        param: result,
                    };
                    this.postData("/gponont_mgmt?form=info", data)
                        .then(() => {
                            this.getBaseInfo(this.port_id, this.ont_id);
                        })
                        .catch(() => {});
                    this.dialogVisible = false;
                }
            });
        },
        refreshData() {
            debounce(this.getData, 1000, this);
        },
        getOpticalInfo(port_id, ont_id) {
            this.opticalInfo = {};
            this.$http
                .get(
                    `/gponont_mgmt?form=ont_optical&port_id=${port_id}&ont_id=${ont_id}`
                )
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.opticalInfo = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getAlarmList(port_id, ont_id) {
            this.alarmList = [];
            this.$http
                .get(
                    `/gponont_mgmt?form=ont_alarm&port_id=${port_id}&ont_id=${ont_id}`
                )
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.alarmList = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getIpconfig(port_id, ont_id) {
            this.ontIpconfig = [];
            this.$http
                .get(
                    `/gponont_mgmt?form=ipconfig&port_id=${port_id}&ont_id=${ont_id}&index=0xff`
                )
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.ontIpconfig = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getWanConnect(port_id, ont_id) {
            this.wanConnect = [];
            this.$http
                .get(
                    `/gponont_mgmt?form=wanconfig&port_id=${port_id}&ont_id=${ont_id}`
                )
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.wanConnect = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getData() {
            switch (this.activeName) {
                case "basic_info": {
                    if (this.port_id && this.ont_id !== 0xffff) {
                        this.getBaseInfo(this.port_id, this.ont_id);
                        this.getPortInfo(this.port_id, this.ont_id);
                        this.getVersionInfo(this.port_id, this.ont_id);
                    }
                    break;
                }
                case "optical": {
                    if (this.port_id && this.ont_id !== 0xffff) {
                        this.getOpticalInfo(this.port_id, this.ont_id);
                    }
                    break;
                }
                case "alarm": {
                    if (this.port_id && this.ont_id !== 0xffff) {
                        this.getAlarmList(this.port_id, this.ont_id);
                    }
                    break;
                }
                case "ipconfig": {
                    if (this.port_id && this.ont_id !== 0xffff) {
                        this.getIpconfig(this.port_id, this.ont_id);
                    }
                    break;
                }
                case "wan_connect": {
                    if (this.port_id && this.ont_id !== 0xffff) {
                        this.getWanConnect(this.port_id, this.ont_id);
                    }
                }
                case "wlan": {
                    if (this.port_id && this.ont_id !== 0xffff) {
                        this.getWlanInfo(this.port_id, this.ont_id);
                    }
                }
            }
        },
        getWlanInfo(port_id, ont_id) {
            this.wlanInfo = {};
            this.$http
                .get(
                    `/gponont_mgmt?form=wlanconfig&port_id=${port_id}&ont_id=${ont_id}`
                )
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.wlanInfo = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
    },
    watch: {
        activeName() {
            this.getData();
        },
    },
};
</script>

<style lang="less" scoped>
.function-not-support {
    .base-font-style;
    margin-left: 12px;
}
</style>