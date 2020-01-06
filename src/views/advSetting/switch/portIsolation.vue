<template>
    <div>
        <page-header :title="$lang('port_isolation')" type="none"></page-header>
        <h3 class="port-isolation-item">
            <span>PON {{ $lang('port_isolation') }}</span>
            <el-button
                type="primary"
                style="margin-left: 30px;"
                @click="openDialog('add', 'pon')"
            >{{ $lang('add', 'port') }}</el-button>
            <el-button
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
                type="primary"
                style="margin-left: 30px;"
                @click="openDialog('add', 'ge')"
            >{{ $lang('add', 'port') }}</el-button>
            <el-button
                type="primary"
                style="margin-left: 30px;"
                @click="openDialog('delete', 'ge')"
            >{{ $lang('delete', 'port') }}</el-button>
        </h3>
        <div class="port-isolation-list">
            <span>{{ $lang('uplink_isolate_portlist') }}:</span>
            <span>{{ gelist.map(item => getPortName(item)).join(',') || '-' }}</span>
        </div>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
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
import portIsolationForm from "./portIsolation/form";
import postData from "@/mixin/postData";
export default {
    name: "portIsolation",
    mixins: [postData],
    components: { portIsolationForm },
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
        }
    },
    data() {
        return {
            portIsolate: {},
            dialogVisible: false,
            devType: "",
            devAction: ""
        };
    },
    inject: ["updateAdvMainScrollbar"],
    mounted() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.portIsolate = {};
            this.$http
                .get("/switch_isolate?form=isolate")
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
</style>