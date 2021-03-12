<template>
    <div>
        <div style="margin: 12px 0">
            <el-button type="primary" size="small" @click="openDialog">
                {{ $lang("add") }}
            </el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                @click="deleteAll"
            >
                {{ $lang("delete_all") }}
            </el-button>
        </div>
        <el-table :data="data" border>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row class="ont-wan-detail">
                        <el-col :span="8">
                            <span>{{ $lang("ipmask") }}:</span>
                            <span>{{ scope.row.ipmask || "-" }}</span>
                        </el-col>
                        <el-col :span="8">
                            <span>{{ $lang("mtu") }}:</span>
                            <span>{{ scope.row.mtu || "-" }}</span>
                        </el-col>
                        <el-col :span="8">
                            <span>{{ $lang("ipproto") }}:</span>
                            <span>{{ IP_PROTOS_MAP[scope.row.ipproto] }}</span>
                        </el-col>
                    </el-row>
                    <el-row class="ont-wan-detail">
                        <el-col :span="8">
                            <span>{{ $lang("igmpproxy") }}:</span>
                            <span>
                                {{
                                    NOT_CONCERNED_STATUS_MAP[
                                        scope.row.igmpproxy
                                    ]
                                }}
                            </span>
                        </el-col>
                        <el-col :span="8">
                            <span>{{ $lang("pridns") }}:</span>
                            <span>{{ scope.row.pridns || "-" }}</span>
                        </el-col>
                        <el-col :span="8">
                            <span>{{ $lang("secdns") }}:</span>
                            <span>{{ scope.row.secdns || "-" }}</span>
                        </el-col>
                    </el-row>
                    <template v-if="scope.row.ipmode === 3">
                        <el-row class="ont-wan-detail">
                            <el-col :span="8">
                                <span>{{ $lang("pppoemode") }}:</span>
                                <span>
                                    {{
                                        PPPOE_MODE_MAP[scope.row.pppoemode] ||
                                        "-"
                                    }}
                                </span>
                            </el-col>
                            <el-col :span="8">
                                <span>{{ $lang("user") }}:</span>
                                <span>{{ scope.row.user || "-" }}</span>
                            </el-col>
                            <el-col :span="8">
                                <span>{{ $lang("password") }}:</span>
                                <span>{{ scope.row.password || "-" }}</span>
                            </el-col>
                        </el-row>
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                :label="$lang('name')"
                prop="name"
            ></el-table-column>
            <el-table-column :label="$lang('vlan_id')">
                <template slot-scope="scope">
                    {{ scope.row.vlan_id || "-" }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('ctype')">
                <template slot-scope="scope">
                    {{ CTYPE_MAP[scope.row.ctype] }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('ipmode')">
                <template slot-scope="scope">
                    {{ IPMODE_MAP[scope.row.ipmode] }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$lang('ipaddr')"
                prop="ipaddr"
            ></el-table-column>
            <el-table-column
                :label="$lang('gateway')"
                prop="gateway"
            ></el-table-column>
            <el-table-column :label="$lang('status')">
                <template slot-scope="scope">
                    {{ scope.row.status ? "Up" : "Down" }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('config')" width="100px">
                <template slot-scope="scope">
                    <el-button type="text" @click="deleteWan(scope.row)">{{
                        $lang("delete")
                    }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            width="650px"
            destroy-on-close
        >
            <template slot="title">{{ $lang("add") }}</template>
            <ont-wan-form
                ref="ont-wan-form"
                :port-info="portInfo"
            ></ont-wan-form>
            <template slot="footer">
                <el-button @click="dialogVisible = false">
                    {{ $lang("cancel") }}
                </el-button>
                <el-button type="primary" @click="submitForm('ont-wan-form')">
                    {{ $lang("apply") }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
    IPMODE_MAP,
    CTYPE_MAP,
    ONT_PORT_MAP,
    NOT_CONCERNED_STATUS_MAP,
} from "@/utils/commonData";
import ontWanForm from "./wanForm";
import postData from "@/mixin/postData";
export default {
    name: "ontWan",
    components: { ontWanForm },
    computed: {
        ...mapGetters(["$lang"]),
    },
    props: {
        data: {
            type: Array,
        },
        identifier: {
            type: Number,
        },
        portInfo: {
            type: Object,
        },
    },
    data() {
        return {
            CTYPE_MAP,
            IPMODE_MAP,
            ONT_PORT_MAP,
            NOT_CONCERNED_STATUS_MAP,
            PPPOE_MODE_MAP: ["AUTO", "CHAP", "PAP"],
            IP_PROTOS_MAP: { 1: "IPv4", 2: "IPv6", 3: "IPv4/IPv6" },
            dialogVisible: false,
        };
    },
    mixins: [postData],
    methods: {
        refreshData() {
            this.$emit("refresh-data");
        },
        openDialog() {
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs["ont-wan-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((form) => {
                console.log(form);
                if (form) {
                    const post_params = {
                        method: "add",
                        param: {
                            identifier: this.identifier,
                            name: form.name,
                            index: form.index,
                            ipmode: form.ipmode,
                            ctype: form.ctype,
                            mtu: Number(form.mtu),
                            igmpproxy: form.igmpproxy,
                            ipproto: form.ipproto,
                            ipaddr: form.ipaddr,
                            ipmask: form.ipmask,
                            gateway: form.gateway,
                            pppoemode: form.pppoemode,
                            user: form.user,
                            password: form.password,
                            tagmode: form.tagmode,
                            vlan_id: Number(form.vlan_id),
                            requestdns: form.requestdns,
                            pridns: form.pridns,
                            secdns: form.secdns,
                            portmap: form.portmap,
                        },
                    };
                    this.postData("/gponont_mgmt?form=wanconfig", post_params)
                        .then(() => {
                            this.refreshData();
                            this.dialogVisible = false;
                        })
                        .catch(() => {});
                }
            });
        },
        deleteWan(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(() => {
                    this.postData("/gponont_mgmt?form=wanconfig", {
                        method: "delete",
                        param: {
                            identifier: this.identifier,
                            index: row.index,
                            name: row.name,
                        },
                    })
                        .then(() => {
                            this.refreshData();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        deleteAll() {
            this.$confirm(this.$lang("if_sure", "delete_all") + " ?")
                .then(() => {
                    this.postData("/gponont_mgmt?form=wanconfig", {
                        method: "delete",
                        param: {
                            identifier: this.identifier,
                            index: 0xff,
                        },
                    })
                        .then(() => {
                            this.refreshData();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
    },
};
</script>

<style lang="less" scoped>
.ont-wan-detail {
    margin: 12px 0;
    span {
        display: inline-block;
        vertical-align: baseline;
        &:first-child {
            text-align: right;
            padding: 0 12px;
        }
    }
}
</style>