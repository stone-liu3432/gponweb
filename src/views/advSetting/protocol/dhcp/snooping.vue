<template>
    <div>
        <div class="dhcp-snooping-item">
            <span>{{ $lang('snooping_admin') }}:</span>
            <span>{{ $lang(SWITCH[data.snooping_admin]) }}</span>
            <el-button
                type="primary"
                size="mini"
                @click="changeSnoopingAdmin"
            >{{ $lang(BUTTON_TEXT[data.snooping_admin]) }}</el-button>
        </div>
        <template v-if="data.snooping_admin">
            <div class="dhcp-snooping-item">
                <span>{{ $lang('chaddr_check') }}:</span>
                <span>{{ $lang(SWITCH[data.chaddr_check]) }}</span>
                <el-button
                    type="primary"
                    size="mini"
                    @click="openDialog('chaddr_check')"
                >{{ $lang(BUTTON_TEXT[data.chaddr_check]) }}</el-button>
            </div>
            <div class="dhcp-snooping-item">
                <span>{{ $lang('response_time') }}:</span>
                <span>{{ data.response_time }} s</span>
                <el-button
                    type="primary"
                    size="mini"
                    @click="openDialog('response_time')"
                >{{ $lang('config') }}</el-button>
            </div>
            <div class="dhcp-snooping-item">
                <span>{{ $lang('trust_portlist') }}:</span>
                <span>{{ portlist }}</span>
                <el-button
                    type="primary"
                    size="mini"
                    @click="openDialog('add_port')"
                >{{ $lang('add') }}</el-button>
                <el-button
                    type="primary"
                    size="mini"
                    style="margin-left: 30px;"
                    @click="openDialog('delete_port')"
                >{{ $lang('delete') }}</el-button>
            </div>
            <div class="dhcp-snooping-item">
                <h3>
                    <span>{{ $lang('snooping_table') }}</span>
                    <el-button
                        type="primary"
                        size="mini"
                        style="margin-left: 30px;"
                        @click="clearSnoopingTable"
                    >{{ $lang('clear') }}</el-button>
                    <el-button
                        type="primary"
                        size="mini"
                        style="margin-left: 30px;"
                        @click="refreshData"
                    >{{ $lang('refresh') }}</el-button>
                </h3>
                <el-table :data="sonnpingTable" border>
                    <el-table-column :label="$lang('ipaddr')" prop="ipaddr"></el-table-column>
                    <el-table-column :label="$lang('macaddr')" prop="macaddr"></el-table-column>
                    <el-table-column :label="$lang('port_id')">
                        <template slot-scope="scope">{{ getPortName(scope.row.port_id) }}</template>
                    </el-table-column>
                    <el-table-column :label="$lang('vlan_id')" prop="vlan_id"></el-table-column>
                    <el-table-column :label="$lang('lease_time')" prop="lease_time"></el-table-column>
                    <el-table-column :label="$lang('entry_status')">
                        <template slot-scope="scope">{{ ENTRY_STATUS[scope.row.entry_status] }}</template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    style="float: right; margin: 12px 0;"
                    hide-on-single-page
                    :current-page.sync="currentPage"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size.sync="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="snoopingList.length"
                ></el-pagination>
            </div>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <div slot="title">{{ $lang(dialogTitle) }}</div>
            <dhcp-snooping-form ref="dhcp-snooping-form"></dhcp-snooping-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('dhcp-snooping-form')"
                >{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import postData from "@/mixin/postData";
import {
    isFunction,
    isArray,
    parseStringAsList,
    debounce
} from "@/utils/common";
import { SWITCH, BUTTON_TEXT, ENTRY_STATUS } from "@/utils/commonData";
import dhcpSnoopingForm from "./snoopingForm";
export default {
    name: "dhcpSnooping",
    components: { dhcpSnoopingForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        portlist() {
            return parseStringAsList(this.data.trust_portlist)
                .map(item => this.getPortName(item))
                .join(",");
        },
        sonnpingTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.snoopingList.slice(start, start + this.pageSize);
        },
        dialogTitle() {
            const TITLES = {
                response_time: "config",
                add_port: "add",
                delete_port: "delete"
            };
            return TITLES[this.dialogType];
        }
    },
    props: {
        data: {
            type: Object
        }
    },
    mixins: [postData],
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            SWITCH,
            BUTTON_TEXT,
            ENTRY_STATUS,
            snoopingList: [],
            currentPage: 1,
            pageSize: 10,
            dialogVisible: false,
            dialogType: ""
        };
    },
    created() {
        this.getSnooping();
    },
    methods: {
        getSnooping() {
            if (!this.data.snooping_admin) {
                return;
            }
            this.snoopingList = [];
            this.$http
                .get("/switch_dhcp?form=snooping_table")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.snoopingList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        clearSnoopingTable() {
            this.$confirm(
                this.$lang("if_sure", "clear", "snooping_table") + " ?"
            )
                .then(_ => {
                    const url = "/switch_dhcp?form=snooping_flush",
                        post_params = {
                            method: "set",
                            param: {}
                        };
                    this.postData(url, post_params)
                        .then(_ => {
                            this.getSnooping();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        refreshData() {
            debounce(this.getSnooping, 1000, this);
        },
        changeSnoopingAdmin() {
            this.$confirm(
                this.$lang("if_sure", BUTTON_TEXT[this.data.snooping_admin]) +
                    " DHCP Snooping ?"
            )
                .then(_ => {
                    const url = "/switch_dhcp?form=snooping_admin",
                        post_params = {
                            method: "set",
                            param: {
                                snooping_admin: Number(
                                    !this.data.snooping_admin
                                )
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
            this.dialogVisible = true;
            this.dialogType = type;
            this.$nextTick(_ => {
                this.$refs["dhcp-snooping-form"].init(type, this.data);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                if (formData) {
                    const ACTIONS = {
                        response_time(form) {
                            if (
                                form.response_time === this.data.response_time
                            ) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=snooping_response",
                                data: {
                                    method: "set",
                                    param: {
                                        response_time: form.response_time
                                    }
                                }
                            };
                        },
                        add_port(form) {
                            if (
                                form.trust_portlist.length ===
                                parseStringAsList(this.data.trust_portlist)
                                    .length
                            ) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=snooping_trust_add",
                                data: {
                                    method: "set",
                                    param: {
                                        trust_portlist: form.trust_portlist.join(
                                            ","
                                        )
                                    }
                                }
                            };
                        },
                        delete_port(form) {
                            if (!form.trust_portlist.length) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=snooping_trust_del",
                                data: {
                                    method: "set",
                                    param: {
                                        trust_portlist: form.trust_portlist.join(
                                            ","
                                        )
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
                                        this.$emit("refresh-data");
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
.dhcp-snooping-item {
    .base-font-style;
    margin: 12px 0;
    > span {
        display: inline-block;
        vertical-align: middle;
    }
    > span + span {
        margin: 0 30px 0 20px;
        max-width: 600px;
        word-wrap: break-word;
        word-break: break-all;
    }
}
h3 {
    color: @titleColor;
}
</style>