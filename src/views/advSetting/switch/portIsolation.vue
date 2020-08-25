<template>
    <div>
        <page-header :title="$lang('port_group')" type="none"></page-header>
        <div class="port-isolation-mode">
            <span>{{ $lang('port_group_mode') }}:</span>
            <span>{{ $lang(PORT_GROUP_MODE_MAP[port_group_mode]) }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="setPortGroupMode"
            >{{ $lang('config') }}</el-button>
        </div>
        <template v-if="port_group_mode === 1">
            <h3 class="port-isolation-item">
                <span>PON {{ $lang('port_isolation') }}</span>
                <el-button
                    size="small"
                    type="primary"
                    style="margin-left: 30px;"
                    @click="openDialog('add', 'pon')"
                >{{ $lang('add', 'port') }}</el-button>
                <el-button
                    size="small"
                    type="primary"
                    style="margin-left: 30px;"
                    @click="openDialog('delete', 'pon')"
                >{{ $lang('delete', 'port') }}</el-button>
            </h3>
            <div class="port-isolation-list">
                <span>{{ $lang('pon_isolate_portlist') }}:</span>
                <span>{{ ponlist.map(item => getPortName(item)).join(',') || '-' }}</span>
            </div>
            <h3 class="port-isolation-item">
                <span>{{ $lang('uplink', 'port_isolation') }}</span>
                <el-button
                    size="small"
                    type="primary"
                    style="margin-left: 30px;"
                    @click="openDialog('add', 'uplink')"
                >{{ $lang('add', 'port') }}</el-button>
                <el-button
                    size="small"
                    type="primary"
                    style="margin-left: 30px;"
                    @click="openDialog('delete', 'uplink')"
                >{{ $lang('delete', 'port') }}</el-button>
            </h3>
            <div class="port-isolation-list">
                <span>{{ $lang('uplink_isolate_portlist') }}:</span>
                <span>{{ gelist.map(item => getPortName(item)).join(',') || '-' }}</span>
            </div>
        </template>
        <template v-if="port_group_mode === 2">
            <inter-working :data="portIsolate.inter_working || []" @refresh-data="getPortGroup"></inter-working>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="650px">
            <template slot="title">{{ $lang(devAction) }}</template>
            <port-isolation-form
                :type="devType"
                :action="devAction"
                :list="list"
                ref="port-isolation-form"
            ></port-isolation-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('port-isolation-form')"
                >{{ $lang('apply') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, parseStringAsList } from "@/utils/common";
import { PORT_GROUP_MODE_MAP } from "@/utils/commonData";
import interWorking from "./portIsolation/interWorking";
import portIsolationForm from "./portIsolation/form";
import postData from "@/mixin/postData";
export default {
    name: "portIsolation",
    mixins: [postData],
    components: { portIsolationForm, interWorking },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        ponlist() {
            return parseStringAsList(this.portIsolate.pon_isolate_portlist);
        },
        gelist() {
            return parseStringAsList(this.portIsolate.uplink_isolate_portlist);
        },
        list() {
            return this.devType === "pon" ? this.ponlist : this.gelist;
        },
        port_group_mode() {
            return this.portIsolate.port_group_mode;
        }
    },
    data() {
        return {
            PORT_GROUP_MODE_MAP,
            portIsolate: {},
            dialogVisible: false,
            devType: "",
            devAction: "",
            pg_mode: 1
        };
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    created() {
        this.getPortGroup();
    },
    methods: {
        getPortGroup() {
            this.$http
                .get("/switch_isolate?form=port_group")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.portIsolate = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        openDialog(action, type) {
            this.dialogVisible = true;
            this.devType = type;
            this.devAction = action;
            this.$nextTick(_ => {
                this.$refs["port-isolation-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(data => {
                if (data) {
                    const url =
                        this.devType === "pon"
                            ? "/switch_isolate?form=isolate_pon"
                            : "/switch_isolate?form=isolate_uplink";
                    const post_params = {
                        method: this.devAction,
                        param: {
                            uplink_isolate_portlist:
                                this.devType === "pon" ? undefined : data,
                            pon_isolate_portlist:
                                this.devType === "pon" ? data : undefined
                        }
                    };
                    this.postData(url, post_params)
                        .then(_ => {
                            this.getData();
                        })
                        .catch(_ => {});
                    this.dialogVisible = false;
                }
            });
        },
        setPortGroupMode() {
            this.pg_mode = this.port_group_mode;
            this.$msgbox({
                title: this.$lang("config"),
                message: (
                    <div class="pg-form-content">
                        <span>{this.$lang("port_group_mode")}</span>
                        <select v-model={this.pg_mode}>
                            <option value={1}>
                                {this.$lang(PORT_GROUP_MODE_MAP[1])}
                            </option>
                            <option value={2}>
                                {this.$lang(PORT_GROUP_MODE_MAP[2])}
                            </option>
                        </select>
                    </div>
                ),
                confirmButtonText: this.$lang("apply"),
                cancelButtonText: this.$lang("cancel"),
                showCancelButton: true
            })
                .then(_ => {
                    if (this.pg_mode === this.port_group_mode) {
                        return;
                    }
                    this.postData("/switch_isolate?form=port_group_mode", {
                        method: "set",
                        param: {
                            port_group_mode: this.pg_mode
                        }
                    })
                        .then(_ => {
                            this.getPortGroup();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        }
    }
};
</script>

<style lang="less" scoped>
.port-isolation-item {
    span {
        display: inline-block;
        vertical-align: middle;
        color: @titleColor;
        line-height: 32px;
        width: 220px;
    }
}
.port-isolation-list {
    margin: 20px 10px;
    span {
        float: left;
        .base-font-style;
        vertical-align: middle;
        line-height: 32px;
        width: 220px;
        & + span {
            width: calc(~"100% - 220px");
            word-wrap: break-word;
            word-break: break-all;
        }
    }
    &:after {
        content: "";
        display: table;
        clear: both;
    }
}
.port-isolation-mode {
    margin: 20px 10px;
    .base-font-style;
    span + span {
        margin-left: 20px;
    }
}
.pg-form-content {
    span {
        float: left;
        width: 150px;
        line-height: 30px;
        & + div {
            float: left;
        }
    }
    select {
        .base-font-style;
        width: 200px;
        height: 30px;
        text-indent: 10px;
        border-radius: 3px;
    }
    &:after {
        content: "";
        display: table;
        clear: both;
    }
}
</style>