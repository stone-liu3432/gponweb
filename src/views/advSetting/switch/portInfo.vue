<template>
    <div>
        <page-header :title="$lang('port_cfg')" type="none">
            <template slot="content">
                <el-button type="primary" size="mini" @click="refreshData">{{
                    $lang("refresh")
                }}</el-button>
            </template>
        </page-header>
        <el-table
            :data="port"
            border
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            row-key="port_id"
            :expand-row-keys="expandRowKeys"
            :current-row-key="currentRowKey"
        >
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row style="margin: 20px">
                        <el-col :span="8">
                            <span style="padding: 0 12px">
                                {{ $lang("duplex") }}:
                            </span>
                            <span>{{
                                scope.row.duplex === 1
                                    ? $lang("full")
                                    : $lang("half")
                            }}</span>
                        </el-col>
                        <el-col :span="8">
                            <span style="padding: 0 12px">
                                {{ $lang("flow_ctrl") }}: </span
                            ><span>{{
                                scope.row.flow_ctrl === 1
                                    ? $lang("enable")
                                    : $lang("disable")
                            }}</span>
                        </el-col>
                        <el-col :span="8">
                            <span style="padding: 0 12px">
                                {{ $lang("mtu") }}:
                            </span>
                            <span>{{ scope.row.mtu }}</span>
                        </el-col>
                    </el-row>
                    <template v-if="scope.row.port_id > system.ponports">
                        <el-row style="margin: 20px">
                            <el-col :span="8">
                                <span style="padding: 0 12px"
                                    >{{ $lang("erate") }}:
                                </span>
                                <span>{{ scope.row.erate }}</span>
                            </el-col>
                            <el-col :span="8">
                                <span style="padding: 0 12px"
                                    >{{ $lang("irate") }}:</span
                                >
                                <span>{{ scope.row.irate }}</span>
                            </el-col>
                        </el-row>
                    </template>
                </template>
            </el-table-column>
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">{{
                    getPortName(scope.row.port_id)
                }}</template>
            </el-table-column>
            <el-table-column :label="$lang('admin_status')">
                <template slot-scope="scope">{{
                    scope.row.admin_status ? "Enable" : "Disable"
                }}</template>
            </el-table-column>
            <el-table-column :label="$lang('link_status')">
                <template slot-scope="scope">
                    <template v-if="scope.row.link_status">
                        <el-tag type="success">{{ $lang("link_up") }}</el-tag>
                    </template>
                    <template v-else>
                        <el-tag type="danger">{{ $lang("link_down") }}</el-tag>
                    </template>
                </template>
            </el-table-column>
            <el-table-column :label="$lang('speed')">
                <template slot-scope="scope">{{
                    scope.row.auto_neg
                        ? `Auto(${
                              scope.row.speed === "0M" ? "--" : scope.row.speed
                          })`
                        : scope.row.speed
                }}</template>
            </el-table-column>
            <el-table-column :label="$lang('media')">
                <template slot-scope="scope">{{
                    $lang(scope.row.media)
                }}</template>
            </el-table-column>
            <el-table-column
                :label="$lang('pvid')"
                prop="pvid"
            ></el-table-column>
            <el-table-column :label="$lang('desc')" prop="port_desc">
            </el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        style="padding: 3px 0"
                        @click="openDialog(scope.row)"
                        >{{ $lang("config") }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            destroy-on-close
            width="650px"
        >
            <template slot="title">{{ $lang("config") }}</template>
            <port-config-form
                type="sw_port_cfg"
                :port_id="row.port_id"
                :data="row"
                ref="port-config-form"
            >
            </port-config-form>
            <template slot="footer">
                <el-button @click="dialogVisible = false">
                    {{ $lang("cancel") }}
                </el-button>
                <el-button
                    type="primary"
                    @click="submitForm('port-config-form')"
                >
                    {{ $lang("apply") }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { debounce } from "@/utils/common";
import portConfigForm from "./portConfig/form";
import postData from "@/mixin/postData";
export default {
    name: "portInfo",
    components: { portConfigForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        ...mapState(["port", "system"]),
    },
    mixins: [postData],
    data() {
        return {
            dialogVisible: false,
            row: {},
            expandRowKeys: [],
            currentRowKey: 0,
        };
    },
    created() {
        this.getPort();
    },
    inject: ["updateAdvMainScrollbar", "scrollRef"],
    updated() {
        this.$nextTick((_) => {
            this.updateAdvMainScrollbar();
        });
    },
    methods: {
        ...mapActions(["getPort"]),
        openDialog(row) {
            this.row = row;
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs["port-config-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((form) => {
                if (form) {
                    const flags = {
                        admin_status: 0x01,
                        auto_neg: 0x02,
                        duplex: 0x04,
                        flow_ctrl: 0x18,
                        speed: 0x40,
                        mtu: 0x80,
                        pvid: 0x400,
                        port_desc: 0x800,
                    };
                    const flag = this.computedFlag(
                        this.system.ponports < this.row.port_id
                            ? { ...flags, erate: 0x100, irate: 0x200 }
                            : flags,
                        form,
                        this.row
                    );
                    if (flag === 0) {
                        this.$message.error(this.$lang("modify_tips"));
                        return;
                    }
                    const url = "/switch_port?form=port_info",
                        data = {
                            method: "set",
                            param: {
                                port_id: this.row.port_id,
                                flags: flag,
                                admin_status: form.admin_status,
                                auto_neg: form.auto_neg,
                                speed: form.speed,
                                duplex: form.duplex,
                                flow_ctrl: form.flow_ctrl,
                                mtu: form.mtu,
                                erate: form.erate,
                                irate: form.irate,
                                pvid: form.pvid,
                                port_desc: form.port_desc,
                            },
                        };
                    this.postData(url, data)
                        .then(() => {
                            this.getPort();
                        })
                        .catch(() => {})
                        .finally(() => {
                            this.dialogVisible = false;
                        });
                }
            });
        },
        computedFlag(flags, data, baseData) {
            let flag = 0;
            Object.keys(flags).forEach((key) => {
                if (
                    key === "speed" &&
                    baseData.auto_neg &&
                    data.speed !== "auto"
                ) {
                    flag |= flags[key];
                    return;
                }
                if (data[key] !== baseData[key]) {
                    flag |= flags[key];
                }
            });
            return flag;
        },
        refreshData() {
            debounce(this.getPort, 1000, this);
        },
    },
    watch: {
        port() {
            if (this.port.length) {
                if (this.$route.query.port_id) {
                    const port_id = this.$route.query.port_id;
                    // 防止在当前页面刷新时，滚动条滚动至跳转进来的位置
                    // 此功能只在从首页跳转过来时生效一次
                    delete this.$route.query.port_id;
                    this.expandRowKeys.push(port_id);
                    this.currentRowKey = port_id;
                    this.$nextTick(() => {
                        const tr = document.getElementsByClassName(
                            "expanded"
                        )[0];
                        if (tr) {
                            const { top } = tr.getBoundingClientRect();
                            // 减去顶部导航栏的高度
                            this.scrollRef(top - 71);
                        }
                    });
                }
            }
        },
    },
};
</script>

<style lang="less" scoped>
</style>