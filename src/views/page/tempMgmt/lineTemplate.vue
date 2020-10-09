<template>
    <div>
        <nms-filter
            style="margin-left: 10px;"
            :data="lineProfs"
            :primary="filterable"
            @change="dataChange"
        ></nms-filter>
        <el-table :data="lineTable" border>
            <el-table-column
                prop="profname"
                :label="$lang('profname')"
            ></el-table-column>
            <el-table-column
                prop="profid"
                :label="$lang('profid')"
            ></el-table-column>
            <el-table-column
                prop="bindtimes"
                :label="$lang('bindtimes')"
            ></el-table-column>
            <el-table-column width="280px">
                <template slot="header">
                    <span>{{ $lang("config") }}</span>
                    <el-button
                        type="primary"
                        size="small"
                        style="margin-left: 30px;"
                        @click="openDialog('add')"
                        >{{ $lang("add") }}</el-button
                    >
                </template>
                <template slot-scope="scope">
                    <el-button type="text" @click="showDetail(scope.row)">{{
                        $lang("show_detail")
                    }}</el-button>
                    <el-button
                        type="text"
                        style="margin-left: 20px;"
                        @click="showBinding(scope.row)"
                        >{{ $lang("show_binding") }}</el-button
                    >
                    <el-button
                        type="text"
                        style="margin-left: 20px;"
                        @click="deleteProf(scope.row)"
                        >{{ $lang("delete") }}</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin: 12px 0; float: right;"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filterableList.length"
            hide-on-single-page
        ></el-pagination>
        <el-dialog :visible.sync="bindingVisible" width="800px">
            <div slot="title">
                <span>{{ $lang("profid") }}:</span>
                <span style="margin: 0 50px 0 12px;">{{ rowData.profid }}</span>
                <span>{{ $lang("profname") }}:</span>
                <span style="margin: 0 0 0 12px;">{{ rowData.profname }}</span>
            </div>
            <el-table :data="bindingDevices" border>
                <el-table-column :label="$lang('port_id')" width="100px">
                    <template slot-scope="scope">{{
                        getPortName(scope.row.port_id)
                    }}</template>
                </el-table-column>
                <el-table-column :label="$lang('ont_id')">
                    <template slot-scope="scope">{{
                        getOntRange(scope.row)
                    }}</template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 详情 -->
        <el-dialog
            :visible.sync="detailVisible"
            width="900px"
            :before-close="beforeClose"
        >
            <line-detail
                ref="line-detail"
                :data="rowData"
                :lineTable="lineTable"
                :dbaData="dbaProfiles"
                @set-profile="setProfile"
                @submit-modify="submitModify"
            ></line-detail>
        </el-dialog>
        <!-- 添加和设置 -->
        <el-dialog
            :visible.sync="setVisible"
            :title="$lang(dialogType)"
            append-to-body
            width="640px"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :before-close="closeDialog"
            destroy-on-close
        >
            <line-form
                :lineData="dialogData"
                :dbaData="dbaProfiles"
                :lineTable="lineProfs"
                :type="dialogType"
                ref="line-form"
            ></line-form>
            <template slot="footer">
                <el-button @click="closeDialog">{{
                    $lang("cancel")
                }}</el-button>
                <el-button type="primary" @click="submitForm('line-form')">{{
                    $lang("apply")
                }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { isArray, isDef, isFunction, parseStringAsList } from "@/utils/common";
import lineDetail from "./lineTemplate/lineDetail";
import lineForm from "./lineTemplate/lineForm";
import postData from "@/mixin/postData";
export default {
    name: "lineTemplate",
    components: { lineDetail, lineForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        ...mapState(["lineProfs"]),
        lineTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filterableList.slice(start, start + this.pageSize);
        },
        filterable() {
            return [
                {
                    prop: "profid",
                    value: 0,
                    label: this.$lang("profid")
                },
                {
                    prop: "profname",
                    value: 1,
                    label: this.$lang("profname")
                }
            ];
        }
    },
    mixins: [postData],
    props: {
        dbaProfiles: {
            type: Array
        }
    },
    inject: ["updateNavScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateNavScrollbar();
        });
    },
    data() {
        return {
            expandRows: [],
            rowData: {},
            // 查看详情模态框
            detailVisible: false,
            // 添加和设置模态框
            setVisible: false,
            // 已绑定的端口和Oont信息模态框
            bindingVisible: false,
            dialogType: "",
            dialogData: {},
            currentPage: 1,
            pageSize: 10,
            bindingDevices: [],
            filterableList: []
        };
    },
    created() {
        this.getLineProfs();
    },
    methods: {
        ...mapActions(["getLineProfs"]),
        getItem(row) {
            const loading = this.$loading();
            this.rowData = {};
            const url = `/lineprofile?form=self&profid=${row.profid}&profname=${row.profname}`;
            this.$http
                .get(url)
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            const rowData = res.data.data;
                            if (!isArray(rowData.tcont)) {
                                rowData.tcont = [];
                            }
                            if (!isArray(rowData.gem)) {
                                rowData.gem = [];
                            }
                            this.rowData = rowData;
                            this.$nextTick(_ => {
                                this.detailVisible = true;
                            });
                        }
                    } else {
                        this.$message.error(
                            `(${res.data.code}) ${res.data.message}`
                        );
                    }
                })
                .catch(err => {})
                .finally(_ => {
                    loading.close();
                });
        },
        showDetail(row) {
            this.getItem(row);
        },
        openDialog(type, data) {
            this.dialogType = type;
            this.setVisible = true;
            if (isDef(data)) {
                this.dialogData = data;
            }
            this.$nextTick(_ => {
                this.$refs["line-form"].init();
            });
        },
        setProfile(data) {
            this.openDialog("set", data);
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                if (formData) {
                    if (formData.tcont && !formData.tcont.length) {
                        return this.$message.error(
                            this.$lang("least_tcont_tips")
                        );
                    }
                    if (formData.gem && !formData.gem.length) {
                        return this.$message.error(
                            this.$lang("least_gem_tips")
                        );
                    }
                    if (this.validateGem(formData.gem)) {
                        return;
                    }
                    const post_params = {
                        method: type,
                        param: {
                            profname: formData.profname,
                            profid: Number(formData.profid),
                            type: formData.type,
                            mappingmode: formData.mappingmode,
                            tcont: formData.tcont,
                            gem: formData.gem
                        }
                    };
                    this.postData("/lineprofile", post_params)
                        .then(_ => {
                            this.getLineProfs();
                            this.closeDialog();
                        })
                        .catch(_ => {});
                }
            });
        },
        closeDialog(done) {
            this.$refs["line-form"].destroy();
            if (isFunction(done)) {
                done();
            } else {
                this.setVisible = false;
            }
        },
        deleteProf(data) {
            this.$confirm(
                `${this.$lang("if_sure", "delete")} ${data.profname} ?`
            )
                .then(_ => {
                    const url = "/lineprofile",
                        post_data = {
                            method: "delete",
                            param: {
                                profname: data.profname,
                                profid: data.profid
                            }
                        };
                    this.postData(url, post_data).then(_ => {
                        this.getLineProfs();
                    });
                })
                .catch(_ => {});
        },
        getBindingDevices(row) {
            this.bindingDevices = [];
            return this.$http
                .get(
                    `/lineprofile?form=boundinfo&profid=${row.profid}&profname=${row.profname}`
                )
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.bindingDevices = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        showBinding(row) {
            const loading = this.$loading();
            this.getBindingDevices(row)
                .then(_ => {
                    this.bindingVisible = true;
                    this.rowData = row;
                })
                .catch(_ => {})
                .finally(_ => {
                    isFunction(loading.close) && loading.close();
                });
        },
        getOntRange(row) {
            const range = parseStringAsList(row.resource);
            if (!range.length) {
                return "-";
            }
            range.sort((a, b) => a - b);
            const res = range.reduce((pre, item, index) => {
                if (index === 0) {
                    pre.push([item]);
                    return pre;
                }
                const prev = pre[pre.length - 1];
                const last = prev[prev.length - 1];
                if (last + 1 === item) {
                    prev.push(item);
                } else {
                    pre.push([item]);
                }
                return pre;
            }, []);
            return res
                .map(item => {
                    if (item.length > 1) {
                        return `${item[0]}-${item[item.length - 1]}`;
                    }
                    return item.toString();
                })
                .join(",");
        },
        submitModify(data) {
            const flags = this.validateGem(data.gem);
            if (flags) {
                this.$nextTick(_ => {
                    this.$refs["line-detail"].dataChange();
                });
                return;
            }
            this.postData("/lineprofile", {
                method: "set",
                param: data
            })
                .then(_ => {
                    this.getLineProfs();
                })
                .catch(_ => {})
                .finally(_ => {
                    this.detailVisible = false;
                });
        },
        beforeClose(done) {
            const comp = this.$refs["line-detail"];
            if (comp.modifyFlags) {
                this.$confirm(this.$lang("unsave_info"))
                    .then(_ => {
                        comp.submitModify();
                    })
                    .catch(_ => {
                        comp.resetFlags();
                        done();
                    });
            } else {
                done();
            }
        },
        dataChange(data) {
            this.filterableList = data;
        },
        validateGem(gem) {
            const heap = {};
            return gem.some(item => {
                if (item.mapping) {
                    return item.mapping.some(_item => {
                        const vid = _item.vlan_id || 0xffff;
                        if (!heap[vid]) {
                            heap[vid] = {
                                vlan_id: _item.vlan_id,
                                gemindex: item.gemindex,
                                mid: _item.mid,
                                mode: _item.mode,
                                vlan_pri: _item.vlan_pri
                            };
                        } else {
                            // 在设置时，untagged也是一个vlan id
                            // 同一个gemport下，只能有一种mapping模式
                            // 同一个gemport下，正常vlanid范围和untagged，互斥
                            // 不同的gemport下，mapping mode+vlanid+pri不能有重复
                            // 不同的gemport下，priority和其他mapping mode，互斥
                            // 不同的gemport下，模式为vlan或者vlan+pri时，vlan id一致不被允许，提示流已经存在
                            // 互斥时，提示配置冲突
                            const {
                                mode,
                                vlan_id,
                                vlan_pri,
                                mid,
                                gemindex
                            } = heap[vid];
                            // 1-VLAN,2-Priority,3-TCI
                            if (mode === _item.mode) {
                                switch (mode) {
                                    case 1:
                                        this.$message.warning(
                                            `In gemindex ${gemindex} and ${item.gemindex}, has reduplicative VLAN ID: ${vlan_id}`
                                        );
                                        return true;
                                    case 2:
                                        if (vlan_pri === _item.vlan_pri) {
                                            this.$message.warning(
                                                `In gemindex ${gemindex} and ${item.gemindex}, has reduplicative VLAN ID: ${vlan_id} and VLAN priority: ${vlan_pri}`
                                            );
                                            return true;
                                        }
                                        break;
                                    case 3:
                                        // 除 mode 为 pri 时，其他出现vlan_id一致时，非法
                                        this.$message.warning(
                                            `In gemindex ${gemindex} and ${item.gemindex}, has reduplicative VLAN ID: ${vlan_id}`
                                        );
                                        return true;
                                }
                            }
                        }
                    });
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>