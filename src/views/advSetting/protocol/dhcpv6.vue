<template>
    <div>
        <page-header type="none">
            <template slot="title">{{ $lang("dhcp_v6") }}</template>
        </page-header>
        <div class="dhcp-v6-item">
            <span>{{ $lang("dhcpv6_admin") }}:</span>
            <span>
                {{
                    dhcpv6Info.dhcpv6_admin ? $lang("enable") : $lang("disable")
                }}
            </span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                @click="setDhcpV6Admin"
            >
                {{ $lang(BUTTON_TEXT[dhcpv6Info.dhcpv6_admin]) }}
            </el-button>
        </div>
        <template v-if="dhcpv6Info.dhcpv6_admin">
            <div class="dhcp-v6-item">
                <span>{{ $lang("option18_admin") }}:</span>
                <span>
                    {{
                        dhcpv6Info.option18_admin
                            ? $lang("enable")
                            : $lang("disable")
                    }}
                </span>
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px"
                    @click="setOption18Admin"
                >
                    {{ $lang(BUTTON_TEXT[dhcpv6Info.option18_admin]) }}
                </el-button>
            </div>
            <div class="dhcp-v6-item">
                <span>{{ $lang("option37_admin") }}:</span>
                <span>
                    {{
                        dhcpv6Info.option37_admin
                            ? $lang("enable")
                            : $lang("disable")
                    }}
                </span>
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px"
                    @click="setOption37Admin"
                >
                    {{ $lang(BUTTON_TEXT[dhcpv6Info.option37_admin]) }}
                </el-button>
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef } from "@/utils/common";
import { BUTTON_TEXT } from "@/utils/commonData";
import postData from "@/mixin/postData";
export default {
    name: "dhcpV6",
    computed: {
        ...mapGetters(["$lang"]),
    },
    data() {
        return {
            BUTTON_TEXT,
            dhcpv6Info: {},
        };
    },
    mixins: [postData],
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$http
                .get("/switch_dhcp?form=dhcpv6_global")
                .then((res) => {
                    if (res.data.code === 1) {
                        this.dhcpv6Info = res.data.data;
                    }
                })
                .catch((err) => {});
        },
        setDhcpV6Admin() {
            this.$confirm(
                this.$lang(
                    "if_sure",
                    BUTTON_TEXT[this.dhcpv6Info.dhcpv6_admin],
                    "dhcp_v6"
                ) + " ?"
            )
                .then(() => {
                    this.postData("/switch_dhcp?form=dhcpv6_admin", {
                        method: "set",
                        param: {
                            dhcpv6_admin: Number(!this.dhcpv6Info.dhcpv6_admin),
                        },
                    })
                        .then(() => {
                            this.getData();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        setOption18Admin() {
            this.$confirm(
                this.$lang(
                    "if_sure",
                    BUTTON_TEXT[this.dhcpv6Info.option18_admin]
                ) + " Option18 ?"
            )
                .then(() => {
                    this.postData("/switch_dhcp?form=option18_admin", {
                        method: "set",
                        param: {
                            option18_admin: Number(
                                !this.dhcpv6Info.option18_admin
                            ),
                        },
                    })
                        .then(() => {
                            this.getData();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        setOption37Admin() {
            this.$confirm(
                this.$lang(
                    "if_sure",
                    BUTTON_TEXT[this.dhcpv6Info.option37_admin]
                ) + " Option37?"
            )
                .then(() => {
                    this.postData("/switch_dhcp?form=option37_admin", {
                        method: "set",
                        param: {
                            option37_admin: Number(
                                !this.dhcpv6Info.option37_admin
                            ),
                        },
                    })
                        .then(() => {
                            this.getData();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
    },
};
</script>

<style lang="less" scoped>
.dhcp-v6-item {
    margin: 20px 0;
    > span {
        .base-font-style;
        display: inline-block;
        vertical-align: middle;
        padding: 0 12px;
    }
}
</style>