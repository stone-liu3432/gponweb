<template>
    <div>
        <div class="dhcp-relay-item">
            <span>{{ $lang('relay_admin') }}:</span>
            <span>{{ $lang(SWITCH[data.relay_admin || 0]) }}</span>
            <el-button
                size="small"
                type="primary"
                @click="chagneAdmin"
            >{{ $lang(BUTTON_TEXT[data.relay_admin]) }}</el-button>
        </div>
        <template v-if="data.relay_admin">
            <div class="dhcp-relay-item">
                <span>{{ $lang('relay_policy') }}:</span>
                <span>{{ $lang(RELAY_POLICY[data.relay_policy]) }}</span>
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('set')"
                >{{ $lang('config') }}</el-button>
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('add')"
                >{{ $lang('add', 'server_ip') }}</el-button>
            </div>
            <el-table :data="serverTable" border>
                <template v-if="!data.relay_policy">
                    <el-table-column :label="$lang('vlan_id')" prop="vlan_id"></el-table-column>
                </template>
                <template v-else>
                    <el-table-column :label="$lang('option60')" prop="option60"></el-table-column>
                </template>
                <el-table-column :label="$lang('server_ip')" prop="server_ip"></el-table-column>
                <el-table-column :label="$lang('config')" width="120px">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="deleteServerIp(scope.row)"
                        >{{ $lang('delete') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="float: right; margin: 12px 0;"
                hide-on-single-page
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="serverList.length"
            ></el-pagination>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <div slot="title">{{ $lang(dialogType) }}</div>
            <dhcp-relay-form ref="dhcp-relay-form"></dhcp-relay-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('dhcp-relay-form')"
                >{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { RELAY_POLICY, SWITCH, BUTTON_TEXT } from "@/utils/commonData";
import { isArray, isFunction } from "@/utils/common";
import postData from "@/mixin/postData";
import dhcpRelayForm from "./relayForm";
export default {
    name: "dhcpRelay",
    components: { dhcpRelayForm },
    computed: {
        ...mapGetters(["$lang"]),
        serverTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.serverList.slice(start, start + this.pageSize);
        }
    },
    mixins: [postData],
    props: {
        data: {
            type: Object
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
            RELAY_POLICY,
            SWITCH,
            BUTTON_TEXT,
            currentPage: 1,
            pageSize: 10,
            serverList: [],
            dialogVisible: false,
            dialogType: ""
        };
    },
    created() {
        this.getRelay();
    },
    methods: {
        getRelay() {
            const URLS = [
                "/switch_dhcp?form=relay_standard",
                "/switch_dhcp?form=relay_option60"
            ];
            const url = URLS[this.data.relay_policy];
            if (!url || !this.data.relay_admin) {
                return;
            }
            this.serverList = [];
            this.$http
                .get(url)
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.serverList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        deleteServerIp(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    const URLS = [
                            "/switch_dhcp?form=relay_standard_del",
                            "/switch_dhcp?form=relay_option60_del"
                        ],
                        param = this.data.relay_policy
                            ? {
                                  option60: row.option60
                              }
                            : {
                                  vlan_id: row.vlan_id
                              };
                    const url = URLS[this.data.relay_policy],
                        post_params = {
                            method: "set",
                            param: {
                                ...param,
                                server_ip: row.server_ip
                            }
                        };
                    this.postData(url, post_params)
                        .then(_ => {
                            this.getRelay();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        chagneAdmin() {
            const flag = !!this.data.relay_admin;
            this.$confirm(
                this.$lang("if_sure", flag ? "off" : "on") + " DHCP Relay ?"
            )
                .then(_ => {
                    const url = "/switch_dhcp?form=relay_admin",
                        post_params = {
                            method: "set",
                            param: {
                                relay_admin: Number(!flag)
                            }
                        };
                    this.postData(url, post_params)
                        .then(_ => {
                            this.$emit("refresh-data");
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        openDialog(type) {
            this.dialogType = type;
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["dhcp-relay-form"].init(type, this.data);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                if (formData) {
                    const ACTIONS = {
                        add(form) {
                            if (this.data.relay_policy === 0) {
                                return {
                                    url: "/switch_dhcp?form=relay_standard_add",
                                    data: {
                                        method: "set",
                                        param: {
                                            vlan_id: form.vlan_id,
                                            server_ip: form.server_ip
                                        }
                                    }
                                };
                            }
                            return {
                                url: "/switch_dhcp?form=relay_option60_add",
                                data: {
                                    method: "set",
                                    param: {
                                        option60: form.option60,
                                        server_ip: form.server_ip
                                    }
                                }
                            };
                        },
                        set(form) {
                            if (this.data.relay_policy === form.relay_policy) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=relay_policy",
                                data: {
                                    method: "set",
                                    param: {
                                        relay_policy: form.relay_policy
                                    }
                                }
                            };
                        }
                    };
                    if (isFunction(ACTIONS[type])) {
                        const res = ACTIONS[type].call(this, formData);
                        if (res) {
                            const { url, data } = res;
                            url &&
                                data &&
                                this.postData(url, data)
                                    .then(_ => {
                                        // 策略改变时，获取对应策略的 url
                                        if (type === "set") {
                                            this.data.relay_policy =
                                                form.relay_policy;
                                        }
                                        this.getRelay();
                                    })
                                    .catch(_ => {});
                            this.dialogVisible = false;
                        }
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.dhcp-relay-item {
    .base-font-style;
    margin: 12px 0;
    > span {
        display: inline-block;
        vertical-align: middle;
    }
    > span + span {
        margin: 0 30px 0 20px;
    }
}
</style>