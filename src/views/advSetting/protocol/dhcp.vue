<template>
    <div>
        <page-header type="none" title="DHCP"></page-header>
        <div class="dhcp-global-config">
            <span>{{ $lang("dhcp_admin") }}:</span>
            <span>{{ $lang(SWITCH_MAP[info.dhcp_admin || 0]) }}</span>
            <el-button size="small" type="primary" @click="setGlobalAdmin">{{
                $lang(BUTTON_TEXT[info.dhcp_admin]) || "Config"
            }}</el-button>
        </div>
        <template v-if="info.dhcp_admin">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="DHCP Relay" name="relay">
                    <dhcp-relay
                        ref="dhcp-relay"
                        :data="info"
                        @refresh-data="getGlobalInfo"
                        v-if="activeName === 'relay'"
                    ></dhcp-relay>
                </el-tab-pane>
                <el-tab-pane label="DHCP Option82" name="option82">
                    <dhcp-option82
                        ref="dhcp-option82"
                        :data="info"
                        @refresh-data="getGlobalInfo"
                        v-if="activeName === 'option82'"
                    ></dhcp-option82>
                </el-tab-pane>
                <el-tab-pane label="DHCP Snooping" name="snooping">
                    <dhcp-snooping
                        ref="dhcp-snooping"
                        :data="info"
                        @refresh-data="getGlobalInfo"
                        v-if="activeName === 'snooping'"
                    ></dhcp-snooping>
                </el-tab-pane>
                <el-tab-pane label="DHCP Server" name="server">
                    <dhcp-server
                        ref="dhcp-server"
                        :data="info"
                        @refresh-data="getGlobalInfo"
                        v-if="activeName === 'server'"
                    ></dhcp-server>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { isDef } from "@/utils/common";
import { SWITCH_MAP, BUTTON_TEXT } from "@/utils/commonData";
import dhcpRelay from "./dhcp/relay";
import dhcpOption82 from "./dhcp/option82";
import dhcpSnooping from "./dhcp/snooping";
import dhcpServer from "./dhcp/server";
import postData from "@/mixin/postData";
export default {
    name: "dhcpMgmt",
    computed: {
        ...mapGetters(["$lang"]),
    },
    mixins: [postData],
    components: { dhcpRelay, dhcpOption82, dhcpSnooping, dhcpServer },
    data() {
        return {
            SWITCH_MAP,
            BUTTON_TEXT,
            info: {},
            activeName: "relay",
        };
    },
    created() {
        this.getGlobalInfo();
        this.getInterfaces();
    },
    methods: {
        ...mapActions(["getInterfaces"]),
        getGlobalInfo() {
            this.info = {};
            this.$http
                .get("/switch_dhcp?form=global_config")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.info = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        setGlobalAdmin() {
            this.$confirm(
                this.$lang("if_sure", BUTTON_TEXT[this.info.dhcp_admin]) +
                    " DHCP ?"
            )
                .then((_) => {
                    const url = "/switch_dhcp?form=dhcp_admin",
                        post_param = {
                            method: "set",
                            param: {
                                dhcp_admin: Number(!this.info.dhcp_admin),
                            },
                        };
                    this.postData(url, post_param)
                        .then((_) => {
                            this.getGlobalInfo();
                        })
                        .catch((_) => {});
                })
                .catch((_) => {});
        },
    },
};
</script>

<style lang="less" scoped>
.dhcp-global-config {
    .base-font-style;
    margin: 20px 0;
    span {
        display: inline-block;
        vertical-align: middle;
    }
    span + span {
        margin: 0 30px 0 20px;
    }
}
</style>