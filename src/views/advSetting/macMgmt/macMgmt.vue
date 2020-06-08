<template>
    <div>
        <page-header :title="$lang('mac_mgmt')" type="none"></page-header>
        <div class="mag-mgmt-agetime">
            <span>{{ $lang('age') }}:</span>
            <span>{{ age }}</span>
            <el-button type="primary" size="mini" @click="setAge">{{ $lang('config') }}</el-button>
        </div>
        <h4>
            <span>{{ $lang('mac_mgmt') }}</span>
            <el-button
                type="primary"
                size="mini"
                style="margin-left: 30px;"
                @click="openDialog('add')"
            >{{ $lang('add_mac') }}</el-button>
            <el-button
                type="primary"
                size="mini"
                style="margin-left: 30px;"
                @click="openDialog('flush')"
            >{{ $lang('flush_mac') }}</el-button>
        </h4>
        <query-form ref="query-form" @refresh-data="refreshData"></query-form>
        <el-table :data="macTable" border>
            <el-table-column :label="$lang('macaddr')" prop="macaddr"></el-table-column>
            <el-table-column :label="$lang('vlan_id')" prop="vlan_id"></el-table-column>
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">{{ getPortName(scope.row.port_id) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('mac_type')" prop="mac_type">
                <template slot-scope="scope">{{ $lang(MAC_TYPE_MAP[scope.row.mac_type]) || '-' }}</template>
            </el-table-column>
            <el-table-column :label="$lang('svp_id')" prop="svp_id">
                <template
                    slot-scope="scope"
                >{{ scope.row.svp_id === 0xffff ? '-' : scope.row.svp_id }}</template>
            </el-table-column>
            <el-table-column :label="$lang('ont_id')" prop="ont_id">
                <template
                    slot-scope="scope"
                >{{ scope.row.svp_id === 0xffff ? '-' : scope.row.ont_id }}</template>
            </el-table-column>
            <el-table-column :label="$lang('gemport')" prop="gemport">
                <template
                    slot-scope="scope"
                >{{ scope.row.svp_id === 0xffff ? '-' : scope.row.gemport }}</template>
            </el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button type="text" @click="deleteMac(scope.row)">{{ $lang('delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin: 12px 0; text-align: center;">
            <el-button
                type="primary"
                size="mini"
                v-if="isLoadMore"
                @click="loadMoreData"
            >{{ $lang('loadmore') }}</el-button>
        </div>
        <div style="position: relative;">
            <el-pagination
                style="margin: 12px 0 30px 0; position: absolute; right: 0; top: 12px;"
                hide-on-single-page
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="macList.length"
            ></el-pagination>
        </div>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="600px">
            <div slot="title">{{ $lang(TITLE_MAP[dialogType]) }}</div>
            <mac-form ref="mac-form"></mac-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('mac-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { isArray, isDef, removeItem, isFunction } from "@/utils/common";
import { MAC_TYPE_MAP } from "@/utils/commonData";
import postData from "@/mixin/postData";
import queryForm from "./query";
import macForm from "./form";
export default {
    name: "macMgmt",
    computed: {
        ...mapGetters(["$lang", "validateMsg", "getPortName"]),
        ...mapState(["portName"]),
        macTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.macList.slice(start, start + this.pageSize);
        },
        isLoadMore() {
            return (
                Math.ceil(this.macList.length / this.pageSize) ===
                    this.currentPage && this.loadmore
            );
        }
    },
    components: { queryForm, macForm },
    mixins: [postData],
    data() {
        return {
            MAC_TYPE_MAP,
            age: 0,
            macList: [],
            currentPage: 1,
            pageSize: 10,
            dialogType: "",
            dialogVisible: false,
            TITLE_MAP: {
                add: "add_mac",
                flush: "flush_mac"
            },
            loadmore: false
        };
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    created() {
        this.getAge();
    },
    methods: {
        getAge() {
            this.$http
                .get("/switch_mac?form=age")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.age = res.data.data.age >>> 0;
                        }
                    }
                })
                .catch(err => {});
        },
        getMacList(param) {
            if (!this.loadmore) {
                this.macList = [];
            }
            this.$http
                .post("/switch_mac?form=table", {
                    method: "get",
                    param
                })
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            const data = res.data.data;
                            if (this.loadmore) {
                                this.macList = this.macList.concat(data);
                            } else {
                                this.macList = data;
                            }
                            if (data.length % 200 === 0) {
                                this.loadmore = true;
                            } else {
                                this.loadmore = false;
                            }
                        } else {
                            this.loadmore = false;
                        }
                    }
                })
                .catch(err => {});
        },
        setAge() {
            this.$prompt(this.$lang("age"), this.$lang("tips"), {
                confirmButtonText: this.$lang("apply"),
                cancelButtonText: this.$lang("cancel"),
                inputValue: this.age,
                inputValidator: value => {
                    const val = Number(value);
                    if (
                        val !== 0 &&
                        (val < 10 || val > 1000000 || isNaN(val))
                    ) {
                        return this.validateMsg("inputRange", 10, 1000000);
                    }
                    return true;
                }
            })
                .then(({ value }) => {
                    if (Number(value) === this.age) {
                        return this.$message.info(this.$lang("modify_tips"));
                    }
                    this.$http
                        .get(`/switch_mac?form=age&value=${value}`)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(this.$lang("setting_ok"));
                                this.getAge();
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        },
        refreshData(form) {
            this.getMacList(form);
        },
        deleteMac(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    this.postData("/switch_mac?form=table", {
                        method: "delete",
                        param: {
                            mac_type: row.mac_type,
                            macaddr: row.macaddr,
                            vlan_id: row.vlan_id,
                            port_id: row.port_id,
                            svp_id: row.svp_id
                        }
                    })
                        .then(_ => {
                            removeItem(this.macList, row);
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        openDialog(type) {
            this.dialogType = type;
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["mac-form"].init(type);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                if (formData) {
                    const ACTIONS = {
                        add(form) {
                            const params =
                                form.port_type === 0
                                    ? {
                                          vlan_id: form.vlan_id,
                                          port_id: form.port_id,
                                          svp_id: 0xffff
                                      }
                                    : {
                                          svp_id: Number(form.svp_id)
                                      };
                            const param = {
                                mac_type: form.mac_type,
                                macaddr: form.macaddr,
                                ...params
                            };
                            return {
                                url: "/switch_mac?form=table",
                                data: {
                                    method: "add",
                                    param
                                }
                            };
                        },
                        flush(form) {
                            return {
                                url: "/switch_mac?form=table",
                                data: {
                                    method: "clear",
                                    param: {
                                        flags: form.flags,
                                        mac_type: form.mac_type,
                                        vlan_id: form.vlan_id,
                                        port_list: form.port_list.join(",")
                                    }
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
                                        this.$refs["query-form"].getData();
                                    })
                                    .catch(_ => {});
                            this.dialogVisible = false;
                        }
                    }
                }
            });
        },
        loadMoreData() {
            this.$refs["query-form"].loadMore();
        }
    }
};
</script>

<style lang="less" scoped>
.mag-mgmt-agetime {
    .base-font-style;
    margin: 12px;
    > span {
        display: inline-block;
        vertical-align: middle;
    }
    > span + span {
        margin: 0 30px 0 12px;
    }
}
h4 {
    color: @titleColor;
}
</style>