<template>
    <div>
        <h4>
            <span>{{ $lang('info') }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('info')"
            >{{ $lang('config') }}</el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('prio')"
            >{{ $lang('config', 'priority') }}</el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="refreshData"
            >{{ $lang('refresh') }}</el-button>
        </h4>
        <div class="cist-info">
            <template v-for="item in infoEnum">
                <el-row class="cist-info-item">
                    <template v-for="key in item">
                        <el-col style="width: 400px;">
                            <span>{{ $lang(key) }}:</span>
                            <span>{{ key === 'root_port_name' ? getPortName(cistBridge[key]) : cistBridge[key] }}</span>
                        </el-col>
                    </template>
                </el-row>
            </template>
            <template v-for="(item, key) in timeEnum">
                <el-row class="cist-info-item">
                    <el-col style="width: 120px;">
                        <span>{{ $lang(key) }}:</span>
                    </el-col>
                    <template v-for="(_key, _index) in item">
                        <el-col style="width: 200px;">
                            <span
                                :class="{'cist-info-item-first-item': _index === 0}"
                            >{{ $lang(_key) }}:</span>
                            <span>{{ cistBridge[_key] }}</span>
                        </el-col>
                    </template>
                </el-row>
            </template>
        </div>
        <h4>
            {{ $lang('port_list') }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="refreshPort"
            >{{ $lang('refresh') }}</el-button>
        </h4>
        <el-table :data="cistPorts" border>
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">{{ getPortName(scope.row.port_id) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('port_role')" prop="port_role">
                <template slot-scope="scope">{{ PORT_ROLE_MAP[scope.row.port_role] }}</template>
            </el-table-column>
            <el-table-column :label="$lang('port_priority')" prop="port_priority"></el-table-column>
            <el-table-column :label="$lang('port_state')" prop="port_state">
                <template slot-scope="scope">{{ PORT_STATE_MAP[scope.row.port_state] }}</template>
            </el-table-column>
            <el-table-column :label="$lang('admin_external_cost')" prop="admin_external_cost">
                <template slot-scope="scope">{{ scope.row.admin_external_cost ? 'Manual' : 'Auto' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('external_cost')" prop="external_cost"></el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="openDialog('port', scope.row)"
                    >{{ $lang('config') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="650px">
            <div slot="title">{{ $lang('config') }}</div>
            <cist-form ref="cist-form"></cist-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('cist-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef, isArray, isFunction, debounce } from "@/utils/common";
import { PORT_ROLE_MAP, PORT_STATE_MAP } from "@/utils/commonData";
import postData from "@/mixin/postData";
import cistForm from "./cistForm";
export default {
    name: "mstpCist",
    components: { cistForm },
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang", "getPortName"])
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            PORT_ROLE_MAP,
            PORT_STATE_MAP,
            cistBridge: {},
            cistPorts: [],
            infoEnum: [
                ["msti_vlanlist"],
                ["bridge_prio", "bridge_addr"],
                ["designate_prio", "designate_addr"],
                ["regional_prio", "regional_addr"],
                ["root_port_name"],
                ["root_path_cost"],
                ["internal_path_cost"]
            ],
            timeEnum: {
                bridge_time: [
                    "bridge_hello_time",
                    "bridge_forward_delay",
                    "bridge_max_age",
                    "max_hops"
                ],
                root_time: [
                    "root_hello_time",
                    "root_forward_delay",
                    "root_max_age"
                ]
            },
            dialogVisible: false
        };
    },
    created() {
        this.getBridge();
        this.getCistPort();
    },
    methods: {
        getBridge() {
            this.cistBridge = {};
            this.$http
                .get("/switch_mstp?form=cist_bridge_get")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.cistBridge = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        getCistPort() {
            this.cistPorts = [];
            this.$http
                .get("/switch_mstp?form=cist_port_get")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.cistPorts = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        openDialog(type, data) {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["cist-form"].init(type, this.cistBridge, data);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                if (formData) {
                    const ACTIONS = {
                        info(form) {
                            const {
                                bridge_max_age,
                                bridge_hello_time,
                                max_hops,
                                bridge_forward_delay
                            } = form;
                            const set_bridge_max_age =
                                    bridge_max_age ===
                                    this.cistBridge.bridge_max_age
                                        ? 0
                                        : 1,
                                set_bridge_hello_time =
                                    bridge_hello_time ===
                                    this.cistBridge.bridge_hello_time
                                        ? 0
                                        : 1,
                                set_max_hops =
                                    max_hops === this.cistBridge.max_hops
                                        ? 0
                                        : 1,
                                set_bridge_forward_delay =
                                    bridge_forward_delay ===
                                    this.cistBridge.bridge_forward_delay
                                        ? 0
                                        : 1;

                            if (
                                !set_bridge_max_age &&
                                !set_bridge_hello_time &&
                                !set_max_hops &&
                                !set_bridge_forward_delay
                            ) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/switch_mstp?form=cist_bridge_set",
                                data: {
                                    method: "set",
                                    param: {
                                        bridge_max_age,
                                        set_bridge_max_age,
                                        bridge_hello_time,
                                        set_bridge_hello_time,
                                        max_hops,
                                        set_max_hops,
                                        bridge_forward_delay,
                                        set_bridge_forward_delay
                                    }
                                }
                            };
                        },
                        prio(form) {
                            if (
                                form.bridge_prio ===
                                this.cistBridge.bridge_prio / 4096
                            ) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/switch_mstp?form=msti_priority_set",
                                data: {
                                    method: "set",
                                    param: {
                                        mstid: 0,
                                        bridge_prio: form.bridge_prio
                                    }
                                }
                            };
                        },
                        port(form) {
                            const { flag } = form;
                            if (flag) {
                                return {
                                    url: "/switch_mstp?form=msti_port_set",
                                    data: {
                                        method: "set",
                                        param: {
                                            port_id: form.port_id,
                                            mstid: form.port_id,
                                            admin_internal_cost: 0,
                                            set_admin_internal_cost: 0,
                                            port_priority: form.port_priority,
                                            set_port_priority: 1
                                        }
                                    }
                                };
                            }
                            return {
                                url: "/switch_mstp?form=cist_port_set",
                                data: {
                                    method: "set",
                                    param: {
                                        port_id: form.port_id,
                                        bpdu_guard_port: 0,
                                        set_bpdu_guard_port: 0,
                                        admin_p2p: 0,
                                        set_admin_p2p: 0,
                                        admin_external_cost:
                                            form.admin_external_cost,
                                        set_admin_external_cost: 1
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
                                        (type === "info" || type === "prio") &&
                                            this.getBridge();
                                        type === "port" && this.getCistPort();
                                    })
                                    .catch(_ => {});
                            this.dialogVisible = false;
                        }
                    }
                }
            });
        },
        refreshData() {
            debounce(this.getBridge, 1000, this);
        },
        refreshPort() {
            debounce(this.getCistPort, 1000, this);
        }
    }
};
</script>

<style lang="less" scoped>
h4 {
    color: @titleColor;
}
.cist-info {
    .base-font-style;
    > .cist-info-item {
        margin: 12px 0;
        span {
            display: inline-block;
            vertical-align: middle;
        }
        span:first-child {
            width: 120px;
            text-align: right;
        }
        span.cist-info-item-first-item {
            width: auto;
            text-align: left;
            margin-left: 20px;
        }
        span + span {
            margin: 0 0 0 20px;
        }
    }
}
</style>