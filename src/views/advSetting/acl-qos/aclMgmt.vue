<template>
    <div>
        <page-header type="none" :title="$lang('acl_mgmt')">
            <div slot="content">
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('add')"
                >{{ $lang('add') }} ACL</el-button>
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="openDialog('delete')"
                >{{ $lang('delete') }} ACL</el-button>
            </div>
        </page-header>
        <el-table
            :data="aclTable"
            border
            :row-key="getRowKey"
            :expand-row-keys="expands"
            @expand-change="expandChange"
        >
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <template v-if="scope.row.rule">
                        <template v-for="(item, index) in scope.row.rule">
                            <el-row>
                                <el-col :span="4" style="line-height: 32px;">
                                    <div class="arrow-container">
                                        <span v-if="isShowPrio">
                                            <i
                                                :class="['el-icon-arrow-up', { 'not-allowed': index === 0 }]"
                                                @click="moveToPrev(scope.row.rule, item)"
                                            ></i>
                                            <i
                                                :class="['el-icon-arrow-down', { 'not-allowed': index + 1 === scope.row.rule.length }]"
                                                @click="moveToNext(scope.row.rule, item)"
                                            ></i>
                                        </span>
                                        <span>RULE ID: {{ item.rule_id }}</span>
                                    </div>
                                </el-col>
                                <el-col :span="18">
                                    <el-row>
                                        <template v-for="key in itemList(scope.row)">
                                            <el-col :span="8" style="line-height: 32px;">
                                                <span style="margin: 0 10px 0 0;">{{ $lang(key) }}:</span>
                                                <span>{{ renderItem(key, item) }}</span>
                                            </el-col>
                                        </template>
                                        <el-col :span="8"></el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="2">
                                    <el-button
                                        type="text"
                                        @click="deleteRule(scope.row, item)"
                                    >{{ $lang('delete') }}</el-button>
                                </el-col>
                            </el-row>
                            <el-divider></el-divider>
                        </template>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="ACL ID" prop="acl_id"></el-table-column>
            <el-table-column :label="$lang('rule_count')">
                <template slot-scope="scope">{{ scope.row.rule ? scope.row.rule.length : '-' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="openDialog('config', scope.row)"
                        v-if="scope.row.rule && scope.row.rule.length"
                    >{{ $lang('config') }}</el-button>
                    <el-button
                        type="text"
                        @click="openDialog('rule', scope.row)"
                    >{{ $lang('add', 'rule') }}</el-button>
                    <el-button
                        type="text"
                        v-if="expands.includes(scope.row.acl_id) && scope.row.rule && scope.row.rule.length "
                        @click="changePriority(scope.row)"
                    >
                        <span v-if="!isShowPrio">{{ $lang('rule_priority') }}</span>
                        <span v-else>{{ $lang('save') }}</span>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="acl-mgmt-container">
            <el-pagination
                style="margin: 12px 0 30px 0; position: absolute; right: 0; top: 12px;"
                hide-on-single-page
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="aclList.length"
            ></el-pagination>
        </div>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="600px" destroy-on-close>
            <div slot="title">{{ $lang(dialogType) || $lang('config') }}</div>
            <acl-form ref="acl-form"></acl-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('acl-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { isArray, isDef, isFunction } from "@/utils/common";
import { ACL_ACTION_MAP } from "@/utils/commonData";
import aclForm from "./aclMgmt/aclForm";
import postData from "@/mixin/postData";
const MIN_ACL_ID = 2000,
    MAX_ACL_ID = 5999;
export default {
    name: "aclMgmt",
    components: { aclForm },
    computed: {
        ...mapGetters(["$lang"]),
        aclTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.aclList.slice(start, start + this.pageSize);
        }
    },
    mixins: [postData],
    data() {
        return {
            aclList: [],
            currentPage: 1,
            pageSize: 10,
            dialogVisible: false,
            dialogType: "",
            expands: [],
            // 隐藏显示调整优先级按钮
            prio_acl: 0,
            // 隐藏显示每一项前的调整按钮
            isShowPrio: false,
            // 缓存，调整到一半时关闭expand时恢复数据用
            prioCache: []
        };
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    created() {
        this.getAcl();
        this.getTimerange();
    },
    methods: {
        ...mapActions(["getTimerange"]),
        getAcl() {
            this.aclList = [];
            this.$http
                .get(
                    `/switch_acl?form=acl&sacl_id=${MIN_ACL_ID}&eacl_id=${MAX_ACL_ID}`
                )
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.aclList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        itemList({ acl_id }) {
            const base = ["action", "src_ipaddr", "src_ipmask", "timerange"],
                adv = [
                    "action",
                    "protocol",
                    "src_ipaddr",
                    "src_ipmask",
                    "dst_ipaddr",
                    "dst_ipmask",
                    "src_port",
                    "dst_port",
                    "precedence",
                    "dscp",
                    "timerange"
                ],
                link = [
                    "action",
                    "eth_type",
                    "cos",
                    "inner_cos",
                    "vlan_id",
                    "inner_vlan_id",
                    "src_mac",
                    "src_mask",
                    "dst_mac",
                    "dst_mask",
                    "timerange"
                ];
            return acl_id < 3000 ? base : acl_id < 5000 ? adv : link;
        },
        renderItem(key, item) {
            if (key === "action") {
                return ACL_ACTION_MAP[item[key]] || "-";
            }
            return isDef(item[key]) ? item[key] : "-";
        },
        deleteRule(row, item) {
            this.$confirm(this.$lang("if_sure", "delete", "rule") + " ?")
                .then(_ => {
                    this.postData("/switch_acl?form=rule", {
                        method: "delete",
                        param: {
                            acl_id: row.acl_id,
                            rule_id: item.rule_id
                        }
                    })
                        .then(_ => {
                            this.getAcl();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        getRowKey(row) {
            return row.acl_id;
        },
        expandChange(row, expands) {
            this.expands = [];
            this.prio_acl = 0;
            this.isShowPrio = false;
            if (expands.length) {
                this.expands.push(row.acl_id);
                this.prio_acl = row.acl_id;
                this.prioCache = JSON.parse(JSON.stringify(row.rule || []));
            } else {
                if (this.prioCache.length) {
                    const pre = row.rule.map(item => item.rule_id).toString(),
                        curr = this.prioCache
                            .map(item => item.rule_id)
                            .toString();
                    if (pre !== curr) {
                        this.$confirm(this.$lang("if_sure", "rule_priority"))
                            .then(_ => {
                                this.setPriority(row);
                            })
                            .catch(_ => {
                                row.rule = this.prioCache;
                            });
                    }
                }
            }
        },
        openDialog(type, row) {
            this.dialogType = type;
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["acl-form"].init(type, row);
            });
        },
        changePriority(row) {
            if (!this.isShowPrio) {
                this.isShowPrio = true;
            } else {
                this.$confirm(this.$lang("if_sure", "save") + " ?")
                    .then(_ => {
                        this.setPriority(row);
                    })
                    .catch(_ => {});
            }
        },
        setPriority(row) {
            const post_params = {
                method: "modify",
                param: {
                    acl_id: row.acl_id,
                    new_rule_id: row.rule.map(item => item.rule_id)
                }
            };
            this.postData("/switch_acl?form=rulepri", post_params)
                .then(_ => {
                    this.getAcl();
                })
                .catch(_ => {});
        },
        moveToPrev(row, item) {
            const index = row.indexOf(item);
            if (index <= 0) {
                return;
            }
            const prev = row[index - 1],
                curr = row[index];
            this.$set(row, index, prev);
            this.$set(row, index - 1, curr);
        },
        moveToNext(row, item) {
            const index = row.indexOf(item);
            if (index + 1 === row.length) {
                return;
            }
            const curr = row[index],
                next = row[index + 1];
            this.$set(row, index, next);
            this.$set(row, index + 1, curr);
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                if (formData) {
                    const ACTIONS = {
                        add(form) {
                            return {
                                url: "/switch_acl?form=acl",
                                data: {
                                    method: "create",
                                    param: {
                                        acl_id: form.acl_id
                                    }
                                }
                            };
                        },
                        delete(form) {
                            return {
                                url: "/switch_acl?form=acl",
                                data: {
                                    method: "delete",
                                    param: {
                                        acl_id: form.acl_id,
                                        acl_id_e: form.acl_id
                                    }
                                }
                            };
                        },
                        config(form) {
                            const param = this.computedPostdata(form);
                            return {
                                url: "/switch_acl?form=rule",
                                data: {
                                    method: "set",
                                    param
                                }
                            };
                        },
                        rule(form) {
                            const param = this.computedPostdata(form);
                            return {
                                url: "/switch_acl?form=rule",
                                data: {
                                    method: "set",
                                    param
                                }
                            };
                        }
                    };
                    if (isFunction(ACTIONS[type])) {
                        const res = ACTIONS[type].call(this, formData);
                        if (isDef(res)) {
                            const { url, data } = res;
                            url &&
                                data &&
                                this.postData(url, data)
                                    .then(_ => {
                                        this.getAcl();
                                    })
                                    .catch(_ => {});
                            this.dialogVisible = false;
                        }
                    }
                }
            });
        },
        computedPostdata(data) {
            const acl = data.acl_id;
            if (acl < 3000) {
                return {
                    acl_id: data.acl_id,
                    rule_id: data.rule_id,
                    action: data.action,
                    flags: data.flags,
                    src_ipaddr: data.src_ipaddr,
                    src_ipmask: data.src_ipmask,
                    timerange: data.timerange
                };
            }
            if (acl < 5000) {
                return {
                    acl_id: data.acl_id,
                    rule_id: data.rule_id,
                    action: data.action,
                    flags: data.flags,
                    protocol: data.protocol,
                    src_ipaddr: data.src_ipaddr,
                    src_ipmask: data.src_ipmask,
                    dst_ipaddr: data.dst_ipaddr,
                    dst_ipmask: data.dst_ipmask,
                    src_port: data.src_port,
                    dst_port: data.dst_port,
                    precedence: data.precedence,
                    dscp: data.dscp,
                    timerange: data.timerange
                };
            }
            return {
                acl_id: data.acl_id,
                rule_id: data.rule_id,
                action: data.action,
                flags: data.flags,
                eth_type: data.eth_type,
                cos: data.cos,
                inner_cos: data.inner_cos,
                vlan_id: data.vlan_id,
                inner_vlan_id: data.inner_vlan_id,
                src_mac: data.src_mac,
                src_mask: data.src_mask,
                dst_mac: data.dst_mac,
                dst_mask: data.dst_mask,
                timerange: data.timerange
            };
        }
    }
};
</script>

<style lang="less" scoped>
.acl-mgmt-container {
    position: relative;
}
.arrow-container {
    i + i {
        margin: 0 12px;
    }
    span:first-child {
        margin-left: 12px;
    }
}
.not-allowed {
    cursor: not-allowed;
}
</style>