<template>
    <div>
        <div style="margin: 0 0 8px 0">
            <el-button
                type="primary"
                size="mini"
                style="margin-left: 10px"
                @click="openDialog"
            >
                {{ $lang("config") }}
            </el-button>
            <el-button
                type="primary"
                size="mini"
                @click="clearWlan"
                style="margin-left: 30px"
            >
                {{ $lang("delete_all") }}
            </el-button>
        </div>
        <el-row>
            <el-col :span="12">
                <div class="ont-wlan-info-item">
                    <span>{{ $lang("admin_status") }}:</span>
                    <span>
                        {{
                            data.wlan_2_4g_administrator
                                ? $lang("enable")
                                : $lang("disable")
                        }}
                    </span>
                </div>
                <div class="ont-wlan-info-item">
                    <span>{{ $lang("type") }}:</span>
                    <span>2.4G</span>
                </div>
                <div class="ont-wlan-info-item">
                    <span>ssid:</span>
                    <span>{{ data.wlan_2_4g_ssid }}</span>
                </div>
                <div class="ont-wlan-info-item">
                    <span>{{ $lang("password") }}:</span>
                    <span>{{ data.wlan_2_4g_password }}</span>
                </div>
                <div class="ont-wlan-info-item">
                    <span>{{ $lang("encrypt") }}:</span>
                    <span>{{ ENCRYPT_MAP[data.wlan_2_4g_encrypt] }}</span>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="ont-wlan-info-item">
                    <span>{{ $lang("admin_status") }}:</span>
                    <span>
                        {{
                            data.wlan_5g_administrator
                                ? $lang("enable")
                                : $lang("disable")
                        }}
                    </span>
                </div>
                <div class="ont-wlan-info-item">
                    <span>{{ $lang("type") }}:</span>
                    <span>5G</span>
                </div>
                <div class="ont-wlan-info-item">
                    <span>ssid:</span>
                    <span>{{ data.wlan_5g_ssid }}</span>
                </div>
                <div class="ont-wlan-info-item">
                    <span>{{ $lang("password") }}:</span>
                    <span>{{ data.wlan_5g_password }}</span>
                </div>
                <div class="ont-wlan-info-item">
                    <span>{{ $lang("encrypt") }}:</span>
                    <span>{{ ENCRYPT_MAP[data.wlan_5g_encrypt] }}</span>
                </div>
            </el-col>
        </el-row>
        <!-- 
        <div class="wlan-client-title">
            <span>{{ $lang("wlan_client") }}</span>
        </div>
        <el-table :data="wlanClients" border>
            <el-table-column :label="'WLAN ' + $lang('type')" prop="wlan_type">
                <template slot-scope="scope">
                    {{ WLAN_TYPE_MAP[scope.row.wlan_type] }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$lang('macaddr')"
                prop="macaddr"
            ></el-table-column>
            <el-table-column
                :label="$lang('tx_packets')"
                prop="tx_pkts"
            ></el-table-column>
            <el-table-column
                :label="$lang('rx_packets')"
                prop="rx_pkts"
            ></el-table-column>
            <el-table-column :label="$lang('tx_rate')">
                <template slot-scope="scope">
                    {{ `${scope.row.tx_rate}(Mbps)` }}
                </template>
            </el-table-column>
            <el-table-column label="RSSI" prop="rssi"></el-table-column>
            <el-table-column :label="$lang('expired_time')">
                <template slot-scope="scope">
                    {{ `${scope.row.expired_time}(${$lang("secs")})` }}
                </template>
            </el-table-column>
        </el-table> -->
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <template slot="title">{{ $lang("config") }}</template>
            <wlan-form :data="data" ref="ont-wlan-form"></wlan-form>
            <template slot="footer">
                <el-button @click="dialogVisible = false">
                    {{ $lang("cancel") }}
                </el-button>
                <el-button type="primary" @click="submitForm('ont-wlan-form')">
                    {{ $lang("apply") }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ENCRYPT_MAP } from "@/utils/commonData";
import { isArray } from "@/utils/common";
import wlanForm from "./wlanForm";
import postData from "@/mixin/postData";
export default {
    name: "ontWlan",
    components: { wlanForm },
    computed: {
        ...mapGetters(["$lang"]),
    },
    mixins: [postData],
    props: {
        identifier: {
            type: Number,
        },
        data: {
            type: Object,
        },
    },
    data() {
        return {
            ENCRYPT_MAP,
            WLAN_TYPE_MAP: { 1: "2.4G", 2: "5G", 3: "All" },
            dialogVisible: false,
            wlanClients: [],
        };
    },
    created() {
        // this.getWlanClient();
    },
    methods: {
        openDialog() {
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs["ont-wlan-form"].init(this.data);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((form) => {
                if (form) {
                    const url = "/gponmgmt?form=wlan",
                        post_params = {
                            method: "set",
                            param: {
                                identifier: this.identifier,
                                wlan_type: form.wlan_type,
                                wlan_2_4g_administrator:
                                    form.wlan_2_4g_administrator,
                                wlan_2_4g_encrypt: form.wlan_2_4g_encrypt,
                                wlan_2_4g_ssid: form.wlan_2_4g_ssid,
                                wlan_2_4g_password: form.wlan_2_4g_password,
                                wlan_5g_administrator:
                                    form.wlan_5g_administrator,
                                wlan_5g_encrypt: form.wlan_5g_encrypt,
                                wlan_5g_ssid: form.wlan_5g_ssid,
                                wlan_5g_password: form.wlan_5g_password,
                            },
                        };
                    this.postData(url, post_params)
                        .then(() => {
                            this.$emit("refresh-data");
                        })
                        .catch(() => {})
                        .finally(() => {
                            this.dialogVisible = false;
                        });
                }
            });
        },
        clearWlan() {
            this.$confirm(this.$lang("if_sure", "clear") + " ?")
                .then(() => {
                    const url = "/gponmgmt?form=wlan",
                        post_params = {
                            method: "set",
                            param: {
                                identifier: this.identifier,
                                wlan_type: 3,
                                wlan_2_4g_encrypt: 0,
                                wlan_2_4g_ssid: "",
                                wlan_2_4g_password: "",
                                wlan_5g_encrypt: 0,
                                wlan_5g_ssid: "",
                                wlan_5g_password: "",
                            },
                        };
                    this.postData(url, post_params)
                        .then(() => {
                            this.$emit("refresh-data");
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        getWlanClient() {
            this.wlanClients = [];
            this.$http
                .get(
                    `/gponont_mgmt?form=wlanclients&port_id=${
                        (this.identifier >> 8) & 0xff
                    }&ont_id=${this.identifier & 0xff}`
                )
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.wlanClients = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
    },
};
</script>

<style lang="less" scoped>
.ont-wlan-info-item {
    .base-font-style;
    margin: 8px 0;
    > span {
        display: inline-block;
        vertical-align: middle;
        &:first-child {
            width: 120px;
            padding-left: 10px;
        }
    }
}
.wlan-client-title {
    color: @titleColor;
    margin: 20px 0;
}
</style>