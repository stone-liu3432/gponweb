<template>
    <div>
        <page-header :title="$lang('remote_mgmt')" type="none"></page-header>
        <h3>
            {{ $lang("def_route") }}:
            <span class="interface-def-route">{{ gateway }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                @click="setDefRoute"
            >
                {{ $lang("config") }}
            </el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                v-if="!!gateway && gateway !== '0.0.0.0'"
                @click="deleteDefRoute"
            >
                {{ $lang("delete") }}
            </el-button>
        </h3>
        <h3>
            {{ $lang("def_route_v6") }}:
            <span class="interface-def-route">{{ gateway_v6 }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                @click="setDefRouteV6"
            >
                {{ $lang("config") }}
            </el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                @click="deleteDefRouteV6"
            >
                {{ $lang("delete") }}
            </el-button>
        </h3>
        <h3>DNS:</h3>
        <div class="remote-mgmt-dns">
            <span class="interface-dns-title" style="margin-left: 30px">
                {{ $lang("primary") }}:
            </span>
            <span>{{ dnsInfo.primary }}</span>
            <span class="interface-dns-title" style="margin-left: 30px">
                {{ $lang("secondary") }}:
            </span>
            <span>{{ dnsInfo.secondary }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                @click="openDnsDialog('v4')"
            >
                {{ $lang("config") }}
            </el-button>
        </div>
        <div class="remote-mgmt-dns">
            <span class="interface-dns-title" style="margin-left: 30px">
                {{ $lang("primary_v6") }}:
            </span>
            <span>{{ dnsInfo.primary_v6 }}</span>
            <span class="interface-dns-title" style="margin-left: 30px">
                {{ $lang("secondary_v6") }}:
            </span>
            <span>{{ dnsInfo.secondary_v6 }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                @click="openDnsDialog('v6')"
            >
                {{ $lang("config") }}
            </el-button>
        </div>
        <h3>
            {{ $lang("interface") }}
            <el-button
                size="small"
                type="primary"
                style="margin-left: 30px"
                @click="setBound(null, 'inbound', 'add')"
            >
                {{ $lang("add", "inbound") }}
            </el-button>
            <el-button
                size="small"
                type="primary"
                style="margin-left: 30px"
                @click="setOutboundAdmin"
                v-if="outbound"
            >
                {{ $lang(outbound.admin === 1 ? "off" : "on", "outbound") }}
            </el-button>
        </h3>
        <el-table :data="interfaces" border>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row style="margin: 20px">
                        <el-col :span="6">
                            <span style="padding: 0 12px"
                                >{{ $lang("rcvpkts") }}:</span
                            >
                            <span>{{ scope.row.rcvpkts }}</span>
                        </el-col>
                        <el-col :span="6">
                            <span style="padding: 0 12px"
                                >{{ $lang("rcvbytes") }}:</span
                            >
                            <span>{{ scope.row.rcvbytes }}</span>
                        </el-col>
                        <el-col :span="6">
                            <span style="padding: 0 12px"
                                >{{ $lang("transpkts") }}:</span
                            >
                            <span>{{ scope.row.transpkts }}</span>
                        </el-col>
                        <el-col :span="6">
                            <span style="padding: 0 12px"
                                >{{ $lang("transbytes") }}:</span
                            >
                            <span>{{ scope.row.transbytes }}</span>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column
                :label="$lang('interface')"
                prop="interface"
            ></el-table-column>
            <el-table-column
                :label="$lang('ipaddr')"
                prop="ipaddr"
            ></el-table-column>
            <el-table-column
                :label="$lang('ipmask')"
                prop="ipmask"
            ></el-table-column>
            <el-table-column :label="$lang('ipv6')" min-width="230px">
                <template slot-scope="scope">
                    <template v-for="item in scope.row.ipv6_address || []">
                        <div class="remote-mgmt-ipv6-item">{{ item.ipv6 }}</div>
                    </template>
                </template>
            </el-table-column>
            <el-table-column :label="$lang('vlan_id')">
                <template slot-scope="scope">
                    {{ scope.row.vlan_id || "-" }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$lang('macaddr')"
                prop="macaddr"
            ></el-table-column>
            <el-table-column :label="$lang('telnet_status')">
                <template slot-scope="scope">
                    {{
                        scope.row.telnet_status === 1
                            ? $lang("enable")
                            : $lang("disable")
                    }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('config')" width="100px">
                <template slot-scope="scope">
                    <el-dropdown @command="dropdownClick">
                        <span class="el-dropdown-link">
                            {{ $lang("config") }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                :command="{ action: 'config', row: scope.row }"
                            >
                                {{ $lang("config") }}
                            </el-dropdown-item>
                            <template v-if="scope.row.interface !== 'outbound'">
                                <el-dropdown-item
                                    :command="{
                                        action: 'delete',
                                        row: scope.row,
                                    }"
                                >
                                    {{ $lang("delete") }}
                                </el-dropdown-item>
                            </template>
                            <el-dropdown-item
                                :command="{ action: 'telnet', row: scope.row }"
                            >
                                {{
                                    $lang(
                                        scope.row.telnet_status === 1
                                            ? "off"
                                            : "on",
                                        "telnet"
                                    )
                                }}
                            </el-dropdown-item>
                            <template
                                v-if="
                                    scope.row.ipv6_address &&
                                    scope.row.ipv6_address.length < 10
                                "
                            >
                                <el-dropdown-item
                                    :command="{
                                        action: 'add_ipv6',
                                        row: scope.row,
                                    }"
                                >
                                    {{ $lang("add", "ipv6") }}
                                </el-dropdown-item>
                            </template>
                            <template
                                v-if="
                                    scope.row.ipv6_address &&
                                    scope.row.ipv6_address.length
                                "
                            >
                                <el-dropdown-item
                                    :command="{
                                        action: 'delete_ipv6',
                                        row: scope.row,
                                    }"
                                >
                                    {{ $lang("delete", "ipv6") }}
                                </el-dropdown-item>
                            </template>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
            append-to-body
            destroy-on-close
            width="650px"
        >
            <template slot="title">{{
                $lang(dialogType === "add" ? "add" : "set")
            }}</template>
            <remote-form ref="remote-form"></remote-form>
            <span slot="footer">
                <el-button @click="closeDialog">{{
                    $lang("cancel")
                }}</el-button>
                <el-button type="primary" @click="submitForm('remote-form')">{{
                    $lang("apply")
                }}</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="dnsVisible" append-to-body width="650px">
            <div slot="title">{{ $lang("config") }}</div>
            <dns-form ref="dns-form"></dns-form>
            <div slot="footer">
                <el-button @click="dnsVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button type="primary" @click="submitDnsForm('dns-form')">{{
                    $lang("apply")
                }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import remoteCard from "./remote/remoteCard";
import remoteForm from "./remote/remoteForm";
import { isDef, isFunction, isIPv6 } from "@/utils/common";
import postData from "@/mixin/postData";
import dnsForm from "./remote/dnsForm";
export default {
    name: "remoteMgmt",
    components: { remoteCard, remoteForm, dnsForm },
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        ...mapState(["interfaces"]),
        inbound() {
            return this.interfaces.filter(
                (item) => item.interface !== "outbound"
            );
        },
        outbound() {
            return this.interfaces.filter(
                (item) => item.interface === "outbound"
            )[0];
        },
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(() => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            dialogVisible: false,
            dialogType: "",
            post_url: "",
            gateway: "",
            gateway_v6: "",
            inputGateway: "",
            inputGatewayV6: "",
            dnsInfo: {},
            dnsVisible: false,
            ipv6Visible: false,
        };
    },
    created() {
        this.getInterfaces();
        this.getDefRoute();
        this.getDns();
    },
    methods: {
        ...mapActions(["getInterfaces"]),
        setBound(data, type, action) {
            this.dialogType = action;
            const ACTIONS = {
                outbound: {
                    config(data) {
                        this.post_url = "/system?form=outbound";
                        this.dialogVisible = true;
                    },
                },
                inbound: {
                    config(data) {
                        this.post_url = "/system?form=inbound";
                        this.dialogVisible = true;
                    },
                    add() {
                        this.post_url = "/system?form=inbound";
                        this.dialogVisible = true;
                    },
                    delete(data) {
                        const post_params = {
                            method: "delete",
                            param: {
                                interface: data.interface,
                                vlan_id: data.vlan_id,
                            },
                        };
                        this.$confirm(this.$lang("if_sure", "delete") + " ?")
                            .then(() => {
                                this.postData(
                                    "/system?form=inbound",
                                    post_params
                                )
                                    .then(() => {
                                        this.getInterfaces();
                                    })
                                    .catch(() => {});
                            })
                            .catch(() => {});
                    },
                },
            };
            if (isDef(ACTIONS[type]) && isFunction(ACTIONS[type][action])) {
                ACTIONS[type][action].call(this, data);
                if (this.dialogVisible) {
                    this.$nextTick(() => {
                        this.$refs["remote-form"].init(data, action);
                    });
                }
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((data, type) => {
                if (data) {
                    const {
                        ipaddr,
                        ipmask,
                        vlan_id,
                        interface: _interface,
                        ipv6,
                    } = data;
                    const param = {
                        ipaddr,
                        ipmask,
                        vlan_id,
                    };
                    if (
                        this.dialogType === "config" &&
                        _interface === "outbound"
                    ) {
                        delete param["vlan_id"];
                    }
                    if (this.dialogType === "config") {
                        param.interface = _interface;
                    }
                    if (type === "v6") {
                        param.ipv6 = ipv6;
                    }
                    const post_params = {
                        method: this.dialogType === "config" ? "set" : "add",
                        param,
                    };
                    this.postData(this.post_url, post_params)
                        .then(() => {
                            this.getInterfaces();
                        })
                        .catch(() => {});
                    this.closeDialog();
                }
            });
        },
        closeDialog(fn) {
            this.dialogVisible = false;
            this.$nextTick(() => {
                this.dialogType = "";
                this.formData = null;
            });
            if (isFunction(fn)) {
                fn();
            }
        },
        getDefRoute() {
            this.gateway = "";
            this.gateway_v6 = "";
            this.$http
                .get("/switch_route?form=route_default")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.gateway = res.data.data.gateway || "";
                            this.gateway_v6 = res.data.data.gateway_v6 || "";
                        }
                    }
                })
                .catch((err) => {});
        },
        getDns() {
            this.dnsInfo = {};
            this.$http
                .get("/system?form=dns")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.dnsInfo = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        setDefRoute() {
            this.inputGateway = this.gateway;
            this.$prompt(this.$lang("def_route"), this.$lang("config"), {
                confirmButtonText: this.$lang("apply"),
                cancelButtonText: this.$lang("cancel"),
                closeOnClickModal: false,
                closeOnPressEscape: false,
                inputValue: this.inputGateway,
                inputPattern: /^((25[0-5]|2[0-4]\d|1?\d?\d)(\.(?!$)|$)){4}/,
                inputErrorMessage: this.validateMsg("ipaddr"),
            })
                .then(({ value }) => {
                    if (value === this.gateway) {
                        return this.$message.info(this.$lang("modify_tips"));
                    }
                    this.postData("/switch_route?form=route_default", {
                        method: "set",
                        param: {
                            gateway: value,
                        },
                    })
                        .then((_) => {
                            this.getDefRoute();
                        })
                        .catch((_) => {});
                })
                .catch(() => {});
        },
        deleteDefRoute() {
            this.$confirm(this.$lang("if_sure", "delete", "def_route") + " ?")
                .then(() => {
                    this.postData("/switch_route?form=route_default", {
                        method: "delete",
                        param: {
                            gateway: "0.0.0.0",
                        },
                    })
                        .then(() => {
                            this.getDefRoute();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        openDnsDialog(type, row) {
            this.dnsVisible = true;
            this.$nextTick(() => {
                this.$refs["dns-form"].init(row || this.dnsInfo, type);
            });
        },
        submitDnsForm(formName) {
            this.$refs[formName].validate((form, type) => {
                if (form) {
                    const ACTIONS = {
                        v4(formData) {
                            if (
                                formData.primary === this.dnsInfo.primary &&
                                formData.secondary === this.dnsInfo.secondary
                            ) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/system?form=dns",
                                data: {
                                    method: "set",
                                    param: {
                                        primary: formData.primary,
                                        secondary: formData.secondary,
                                    },
                                },
                            };
                        },
                        v6(formData) {
                            if (
                                formData.primary_v6 ===
                                    this.dnsInfo.primary_v6 &&
                                formData.secondary_v6 ===
                                    this.dnsInfo.secondary_v6
                            ) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/system?form=dns_v6",
                                data: {
                                    method: "set",
                                    param: {
                                        primary_v6: formData.primary_v6,
                                        secondary_v6: formData.secondary_v6,
                                    },
                                },
                            };
                        },
                        add_v6(formData) {
                            const url =
                                    formData.interface === "outbound"
                                        ? "/system?form=outbound"
                                        : "/system?form=inbound",
                                param =
                                    formData.interface === "outbound"
                                        ? {
                                              ipv6: formData.ipv6,
                                              interface: formData.interface,
                                          }
                                        : {
                                              ipv6: formData.ipv6,
                                              interface: formData.interface,
                                              vlan_id: formData.vlan_id,
                                          };
                            return {
                                url,
                                data: {
                                    method: "set",
                                    param,
                                },
                            };
                        },
                        delete_v6(formData) {
                            const url =
                                    formData.interface === "outbound"
                                        ? "/system?form=outbound_v6"
                                        : "/system?form=inbound_v6",
                                param =
                                    formData.interface === "outbound"
                                        ? {
                                              ipv6: formData.ipv6,
                                              interface: formData.interface,
                                          }
                                        : {
                                              ipv6: formData.ipv6,
                                              interface: formData.interface,
                                              vlan_id: formData.vlan_id,
                                          };
                            return {
                                url,
                                data: {
                                    method: "delete",
                                    param,
                                },
                            };
                        },
                    };
                    if (isFunction(ACTIONS[type])) {
                        const res = ACTIONS[type].call(this, form);
                        if (isDef(res)) {
                            const { url, data } = res;
                            this.postData(url, data)
                                .then(() => {
                                    if (type === "v4" || type === "v6") {
                                        this.getDns();
                                    } else {
                                        this.getInterfaces();
                                    }
                                })
                                .catch(() => {})
                                .finally(() => {
                                    this.dnsVisible = false;
                                });
                        }
                    }
                }
            });
        },
        deleteDefRouteV6() {
            this.$confirm(
                this.$lang("if_sure", "delete", "def_route_v6") + " ?"
            )
                .then(() => {
                    this.postData("/switch_route?form=route_default_v6", {
                        method: "delete",
                        param: {
                            gateway_v6: "",
                        },
                    })
                        .then(() => {
                            this.getDefRoute();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        setDefRouteV6() {
            this.inputGatewayV6 = this.gateway_v6;
            this.$prompt(this.$lang("def_route_v6"), this.$lang("config"), {
                confirmButtonText: this.$lang("apply"),
                cancelButtonText: this.$lang("cancel"),
                closeOnClickModal: false,
                closeOnPressEscape: false,
                inputValue: this.inputGatewayV6,
                inputValidator: (val) => isIPv6(val),
            })
                .then(({ value }) => {
                    if (value === this.gateway_v6) {
                        return this.$message.info(this.$lang("modify_tips"));
                    }
                    this.postData("/switch_route?form=route_default_v6", {
                        method: "set",
                        param: {
                            gateway_v6: value,
                        },
                    })
                        .then(() => {
                            this.getDefRoute();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        dropdownClick({ action, row }) {
            const ACTIONS = {
                config(row) {
                    this.setBound(
                        row,
                        row.interface === "outbound" ? "outbound" : "inbound",
                        "config"
                    );
                },
                delete(row) {
                    this.setBound(
                        row,
                        row.interface === "outbound" ? "outbound" : "inbound",
                        "delete"
                    );
                },
                telnet(row) {
                    this.changeTelnetStatus(row);
                },
                add_ipv6(row) {
                    this.openDnsDialog("add_v6", row);
                },
                delete_ipv6(row) {
                    this.openDnsDialog("delete_v6", row);
                },
            };
            if (isFunction(ACTIONS[action])) {
                ACTIONS[action].call(this, row);
            }
        },
        changeTelnetStatus(row) {
            this.$confirm(
                this.$lang(
                    "if_sure",
                    row.telnet_status === 1 ? "off" : "on",
                    "telnet"
                ) + " ?"
            )
                .then(() => {
                    this.postData("/system?form=telnet_status", {
                        method: "set",
                        param: {
                            telnet_status: row.telnet_status === 1 ? 2 : 1,
                            vlan_id: row.vlan_id || 0,
                        },
                    })
                        .then(() => {
                            this.getInterfaces();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        setOutboundAdmin() {
            this.$confirm(
                this.$lang(
                    this.outbound.admin === 1 ? "off" : "on",
                    "outbound"
                ) + " ?"
            )
                .then(() => {
                    this.postData("/system?form=admin", {
                        method: "set",
                        param: {
                            admin: this.outbound.admin === 1 ? 2 : 1,
                        },
                    })
                        .then(() => {
                            this.getInterfaces();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
    },
};
</script>

<style lang="less" scoped>
h3 {
    color: @titleColor;
}
.interface-def-route {
    .base-font-style;
    font-weight: normal;
    margin-left: 12px;
}
h3 {
    span {
        .base-font-style;
        display: inline-block;
        vertical-align: middle;
        font-weight: normal;
    }
    span + span {
        margin-left: 12px;
    }
}
.remote-mgmt-dns {
    margin: 12px 0;
    .base-font-style;
    .interface-dns-title {
        color: @titleColor;
    }
}
.remote-mgmt-ipv6-item {
    padding: 6px;
    border-bottom: @border-style;
}
</style>