<template>
    <div>
        <div class="dhcp-server-item">
            <span>{{ $lang("server_admin") }}:</span>
            <span>{{ $lang(SWITCH_MAP[data.server_admin]) }}</span>
            <el-button type="primary" size="small" @click="changeServerAdmin">{{
                $lang(BUTTON_TEXT[data.server_admin])
            }}</el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                v-if="data.server_admin"
                @click="openDialog('info')"
                >{{ $lang("config") }}</el-button
            >
        </div>
        <template v-if="data.server_admin">
            <div class="dhcp-server-item">
                <span>{{ $lang("interface") }}:</span>
                <span>{{ getInterface(data.interface) }}</span>
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('interface')"
                    >{{ $lang("config", "interface") }}</el-button
                >
            </div>
            <div class="dhcp-server-item">
                <span>{{ $lang("ipaddress_s") }}:</span>
                <span>{{ data.ipaddress_s || "-" }}</span>
            </div>
            <div class="dhcp-server-item">
                <span>{{ $lang("ipaddress_e") }}:</span>
                <span>{{ data.ipaddress_e || "-" }}</span>
            </div>
            <div class="dhcp-server-item">
                <span>{{ $lang("ipmask") }}:</span>
                <span>{{ data.ipmask || "-" }}</span>
            </div>
            <div class="dhcp-server-item">
                <span>{{ $lang("pridns") }}:</span>
                <span>{{ data.pridns || "-" }}</span>
            </div>
            <div class="dhcp-server-item">
                <span>{{ $lang("secdns") }}:</span>
                <span>{{ data.secdns || "-" }}</span>
            </div>
            <div class="dhcp-server-item">
                <span>{{ $lang("gateway") }}:</span>
                <span>{{ data.gateway || "-" }}</span>
            </div>
            <div class="dhcp-server-item">
                <span>{{ $lang("lease_time") }}:</span>
                <span>{{ data.lease_time }}</span>
            </div>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="650px">
            <div slot="title">{{ $lang("config") }}</div>
            <dhcp-server-form ref="dhcp-server-form"></dhcp-server-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('dhcp-server-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { SWITCH_MAP, BUTTON_TEXT } from "@/utils/commonData";
import { isFunction } from "@/utils/common";
import postData from "@/mixin/postData";
import dhcpServerForm from "./serverForm";
export default {
    name: "dhcpServer",
    computed: {
        ...mapGetters(["$lang"]),
        ...mapState(["interfaces"]),
    },
    components: { dhcpServerForm },
    mixins: [postData],
    props: {
        data: {
            type: Object,
        },
    },
    inject: ["updateAdvMainScrollbar"],
    mounted() {
        this.updateAdvMainScrollbar();
    },
    data() {
        return {
            SWITCH_MAP,
            BUTTON_TEXT,
            dialogVisible: false,
        };
    },
    methods: {
        changeServerAdmin() {
            this.$confirm(
                this.$lang("if_sure", BUTTON_TEXT[this.data.server_admin]) +
                    " DHCP Server ?"
            )
                .then((_) => {
                    const url = "/switch_dhcp?form=server_admin",
                        post_params = {
                            method: "set",
                            param: {
                                server_admin: Number(!this.data.server_admin),
                            },
                        };
                    this.postData(url, post_params)
                        .then((_) => {
                            this.$emit("refresh-data");
                        })
                        .catch((_) => {});
                })
                .catch((_) => {});
        },
        getInterface(vlan_id) {
            const res = this.interfaces.filter(
                (item) => item.vlan_id === vlan_id
            )[0];
            return res ? res.interface : "-";
        },
        openDialog(type) {
            this.dialogVisible = true;
            this.$nextTick((_) => {
                this.$refs["dhcp-server-form"].init(type, this.data);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                if (formData) {
                    const ACTIONS = {
                        interface(form) {
                            if (form.interface === this.data.interface) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=server_cfg",
                                data: {
                                    method: "set",
                                    param: {
                                        flags: 0x4,
                                        interface: form.interface,
                                    },
                                },
                            };
                        },
                        info(form) {
                            if (form.flags === 0) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=server_cfg",
                                data: {
                                    method: "set",
                                    param: {
                                        flags: form.flags,
                                        ipaddress_s: form.ipaddress_s,
                                        ipaddress_e: form.ipaddress_e,
                                        ipmask: form.ipmask,
                                        interface: form.interface,
                                        pridns: form.pridns,
                                        secdns: form.secdns,
                                        gateway: form.gateway,
                                        lease_time: form.lease_time,
                                    },
                                },
                            };
                        },
                    };
                    if (isFunction(ACTIONS[type])) {
                        const res = ACTIONS[type].call(this, formData);
                        if (res) {
                            const { url, data } = res;
                            url &&
                                data &&
                                this.postData(url, data)
                                    .then((_) => {
                                        this.$emit("refresh-data");
                                    })
                                    .catch((_) => {});
                            this.dialogVisible = false;
                        }
                    }
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
.dhcp-server-item {
    .base-font-style;
    margin: 20px 0;
    > span {
        display: inline-block;
        vertical-align: middle;
        &:first-child {
            width: 160px;
        }
    }
    > span + span {
        margin: 0 30px 0 20px;
    }
}
</style>