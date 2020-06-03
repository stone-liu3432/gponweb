<template>
    <div>
        <page-header :title="$lang('route_cfg')" type="none"></page-header>
        <h4>
            <span>{{ $lang('route', 'status') }}:</span>
            <span>{{ $lang(SWITCH[routeStatus]) }}</span>
            <el-button
                type="primary"
                size="mini"
                @click="changeAdmin"
            >{{ $lang(BUTTON_TEXT[routeStatus]) }}</el-button>
        </h4>
        <template v-if="!!routeStatus">
            <h4>
                <span>{{ $lang('static_route') }}</span>
                <el-button
                    type="primary"
                    size="mini"
                    style="margin-left: 30px;"
                    @click="addStaticRoute"
                >{{ $lang('add') }}</el-button>
                <el-button
                    type="primary"
                    size="mini"
                    style="margin-left: 30px;"
                    @click="refreshData"
                >{{ $lang('refresh') }}</el-button>
            </h4>
            <el-table :data="routeList" border>
                <el-table-column :label="`${$lang('dst_ipaddr')} / ${$lang('mask')}`">
                    <template
                        slot-scope="scope"
                    >{{ `${scope.row.ipaddress || ''}/${scope.row.mask_num || ''}` }}</template>
                </el-table-column>
                <el-table-column :label="$lang('next_hop')" prop="gateway"></el-table-column>
                <el-table-column :label="$lang('interface')" prop="interface"></el-table-column>
                <el-table-column :label="$lang('protocol')" prop="protocol">
                    <template slot-scope="scope">{{ STATIC_ROUTE_PROTOCOL_MAP[scope.row.protocol] }}</template>
                </el-table-column>
                <el-table-column :label="$lang('preference')" prop="preference"></el-table-column>
                <el-table-column :label="$lang('status')" prop="status">
                    <template slot-scope="scope">{{ STATIC_ROUTE_STATUS_MAP[scope.row.status] }}</template>
                </el-table-column>
                <el-table-column :label="$lang('config')" width="100px">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            v-if="scope.row.protocol !== 1"
                            @click="deleteStaticRoute(scope.row)"
                        >{{ $lang('delete') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <div slot="title">{{ $lang('add') }}</div>
            <static-route-form ref="static-route-form"></static-route-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('static-route-form')"
                >{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
    BUTTON_TEXT,
    SWITCH,
    STATIC_ROUTE_PROTOCOL_MAP,
    STATIC_ROUTE_STATUS_MAP
} from "@/utils/commonData";
import { isArray, isDef, debounce } from "@/utils/common";
import staticRouteForm from "./staticRoute/staticRouteForm";
import postData from "@/mixin/postData";
export default {
    name: "staticRoute",
    computed: {
        ...mapGetters(["$lang"])
    },
    mixins: [postData],
    components: { staticRouteForm },
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
            STATIC_ROUTE_STATUS_MAP,
            STATIC_ROUTE_PROTOCOL_MAP,
            routeStatus: 0,
            routeList: [],
            dialogVisible: false
        };
    },

    created() {
        this.getRouteStatus();
    },
    methods: {
        getRouteStatus() {
            this.$http
                .get("/switch_route?form=admin_status")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.routeStatus = res.data.data.status;
                            if (this.routeStatus) {
                                this.getRouteList();
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        getRouteList() {
            this.routeList = [];
            this.$http
                .get("/switch_route?form=route_table")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.routeList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        deleteStaticRoute(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    this.postData("/switch_route?form=static_route", {
                        method: "delete",
                        param: {
                            ipaddress: row.ipaddress,
                            mask: row.mask,
                            gateway: row.gateway
                        }
                    })
                        .then(_ => {
                            this.getRouteList();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        refreshData() {
            debounce(this.getRouteList, 1000, this);
        },
        changeAdmin() {
            this.$confirm(
                this.$lang("if_sure", BUTTON_TEXT[this.routeStatus], "route") +
                    " ?"
            )
                .then(_ => {
                    this.postData("/switch_route?form=admin", {
                        method: "set",
                        param: {
                            status: Number(!this.routeStatus)
                        }
                    })
                        .then(_ => {
                            this.getRouteStatus();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        addStaticRoute() {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["static-route-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (formData) {
                    this.postData("/switch_route?form=static_route", {
                        method: "set",
                        param: {
                            ipaddress: formData.ipaddress,
                            mask: formData.mask,
                            gateway: formData.gateway
                        }
                    })
                        .then(_ => {
                            this.getRouteList();
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
h4 {
    color: @titleColor;
    > span {
        display: inline-block;
        vertical-align: middle;
    }
    > span + span {
        margin: 0 30px 0 12px;
    }
}
</style>