<template>
    <div>
        <page-header :title="$lang('remote_mgmt')" type="none"></page-header>
        <h3>
            {{ $lang('def_route') }}:
            <span class="interface-def-route">{{ gateway }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="setDefRoute"
            >{{ $lang('config') }}</el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                v-if="!!gateway && gateway !== '0.0.0.0'"
                @click="deleteDefRoute"
            >{{ $lang('delete') }}</el-button>
        </h3>
        <h3>
            DNS:
            <span class="interface-dns-title" style="margin-left: 30px;">{{ $lang('primary') }}:</span>
            <span>{{ dnsInfo.primary }}</span>
            <span class="interface-dns-title" style="margin-left: 30px;">{{ $lang('secondary') }}:</span>
            <span>{{ dnsInfo.secondary }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDnsDialog"
            >{{ $lang('config') }}</el-button>
        </h3>
        <template v-if="!!outbound">
            <remote-card :type="dialogType" :bound-data="outbound" @handle-config="setBound"></remote-card>
        </template>
        <h3>
            {{ $lang('inbound') }}
            <el-button
                size="small"
                type="primary"
                style="margin-left: 30px;"
                @click="setBound(null, 'inbound', 'add')"
            >{{ $lang('add', 'inbound') }}</el-button>
        </h3>
        <template v-for="item in inbound">
            <remote-card :type="dialogType" :bound-data="item" @handle-config="setBound"></remote-card>
        </template>
        <el-dialog
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
            append-to-body
            width="650px"
        >
            <template slot="title">{{ $lang(dialogType === 'add' ? 'add' : 'set') }}</template>
            <remote-form :type="dialogType" :form-data="formData" ref="remote-form"></remote-form>
            <span slot="footer">
                <el-button @click="closeDialog">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('remote-form')">{{ $lang('apply') }}</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="dnsVisible" append-to-body width="650px">
            <div slot="title">{{ $lang('config') }}</div>
            <dns-form ref="dns-form"></dns-form>
            <div slot="footer">
                <el-button @click="dnsVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitDnsForm('dns-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import remoteCard from "./remote/remoteCard";
import remoteForm from "./remote/remoteForm";
import { isDef, isFunction } from "@/utils/common";
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
                item => item.interface !== "outbound"
            );
        },
        outbound() {
            return this.interfaces.filter(
                item => item.interface === "outbound"
            )[0];
        }
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            dialogVisible: false,
            dialogType: "",
            post_url: "",
            formData: {},
            gateway: "",
            inputGateway: "",
            dnsInfo: {},
            dnsVisible: false
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
            this.formData = data;
            const ACTIONS = {
                outbound: {
                    config(data) {
                        this.post_url = "/system?form=outbound";
                        this.dialogVisible = true;
                    }
                },
                inbound: {
                    config(data) {
                        this.post_url = "/system?form=inbound";
                        this.dialogVisible = true;
                    },
                    add() {
                        this.post_url = "/system?form=inbound";
                        this.dialogVisible = true;
                        this.formData = {};
                    },
                    delete(data) {
                        const post_params = {
                            method: "delete",
                            param: {
                                interface: data.interface,
                                vlan_id: data.vlan_id
                            }
                        };
                        this.$confirm(this.$lang("if_sure", "delete"))
                            .then(_ => {
                                this.postData(
                                    "/system?form=inbound",
                                    post_params
                                )
                                    .then(_ => {
                                        this.getInterfaces();
                                    })
                                    .catch(_ => {});
                            })
                            .catch(_ => {});
                    }
                }
            };
            if (isDef(ACTIONS[type]) && isFunction(ACTIONS[type][action])) {
                ACTIONS[type][action].call(this, data);
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(data => {
                if (data) {
                    const {
                        ipaddr,
                        ipmask,
                        vlan_id,
                        interface: _interface
                    } = data;
                    const post_params = {
                        method: this.dialogType === "config" ? "set" : "add",
                        param: {
                            ipaddr,
                            ipmask,
                            vlan_id,
                            // undefined，JSON化时将会忽略此参数
                            interface: _interface || undefined
                        }
                    };
                    this.postData(this.post_url, post_params)
                        .then(_ => {
                            this.getInterfaces();
                        })
                        .catch(_ => {});
                    this.closeDialog();
                }
            });
        },
        closeDialog(fn) {
            this.dialogVisible = false;
            this.$nextTick(_ => {
                this.dialogType = "";
                this.formData = null;
            });
            if (isFunction(fn)) {
                fn();
            }
        },
        getDefRoute() {
            this.gateway = "";
            this.$http
                .get("/switch_route?form=route_default")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.gateway = res.data.data.gateway || "";
                        }
                    }
                })
                .catch(err => {});
        },
        getDns() {
            this.dnsInfo = {};
            this.$http
                .get("/system?form=dns")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.dnsInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {});
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
                inputErrorMessage: this.validateMsg("ipaddr")
            })
                .then(({ value }) => {
                    if (value === this.gateway) {
                        return this.$message.info(this.$lang("modify_tips"));
                    }
                    this.postData("/switch_route?form=route_default", {
                        method: "set",
                        param: {
                            gateway: value
                        }
                    })
                        .then(_ => {
                            this.getDefRoute();
                        })
                        .catch(_ => {});
                })
                .catch(() => {});
        },
        deleteDefRoute() {
            this.$confirm(this.$lang("if_sure", "delete", "def_route") + " ?")
                .then(_ => {
                    this.postData("/switch_route?form=route_default", {
                        method: "delete",
                        param: {
                            gateway: "0.0.0.0"
                        }
                    })
                        .then(_ => {
                            this.getDefRoute();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        openDnsDialog() {
            this.dnsVisible = true;
            this.$nextTick(_ => {
                this.$refs["dns-form"].init(this.dnsInfo);
            });
        },
        submitDnsForm(formName) {
            this.$refs[formName].validate(form => {
                if (form) {
                    if (
                        form.primary === this.dnsInfo.primary &&
                        form.secondary === this.dnsInfo.secondary
                    ) {
                        return this.$message.info(this.$lang("modify_tips"));
                    }
                    this.postData("/system?form=dns", {
                        method: "set",
                        param: {
                            primary: form.primary,
                            secondary: form.secondary
                        }
                    })
                        .then(_ => {
                            this.getDns();
                        })
                        .catch(_ => {});
                    this.dnsVisible = false;
                }
            });
        }
    }
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
    // .interface-dns-title {
    //     color: @titleColor;
    // }
}
</style>