<template>
    <div>
        <el-table :data="lineTable" border stripe>
            <el-table-column prop="profname" :label="$lang('profname')"></el-table-column>
            <el-table-column prop="profid" :label="$lang('profid')"></el-table-column>
            <el-table-column prop="bindtimes" :label="$lang('bindtimes')"></el-table-column>
            <el-table-column width="240px">
                <template slot="header">
                    <span>{{ $lang('config') }}</span>
                    <el-button
                        type="primary"
                        size="mini"
                        style="margin-left: 30px;"
                        @click="openDialog('add')"
                    >{{ $lang('add') }}</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button type="text" @click="showDetail(scope.row)">{{ $lang('show_detail') }}</el-button>
                    <el-button
                        type="text"
                        style="margin-left: 20px;"
                        @click="showBinding(scope.row)"
                    >{{ $lang('show_binding') }}</el-button>
                    <el-button
                        type="text"
                        style="margin-left: 20px;"
                        @click="deleteProf(scope.row)"
                    >{{ $lang('delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin: 12px 0; float: right;"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="lineProfs.length"
            hide-on-single-page
        ></el-pagination>
        <el-dialog :visible.sync="bindingVisible" width="800px">
            <div slot="title">
                <span>{{ $lang('profid') }}:</span>
                <span style="margin: 0 50px 0 12px;">{{ rowData.profid }}</span>
                <span>{{ $lang('profname') }}:</span>
                <span style="margin: 0 0 0 12px;">{{ rowData.profname }}</span>
            </div>
            <el-table :data="bindingDevices" border>
                <el-table-column :label="$lang('port_id')" width="100px">
                    <template slot-scope="scope">{{ getPortName(scope.row.port_id) }}</template>
                </el-table-column>
                <el-table-column :label="$lang('ont_id')">
                    <template slot-scope="scope">
                        <!-- <template v-for="(item, index) in getOntList(scope.row)">
                            <template v-if="index !== 0">,&nbsp;</template>
                            <el-link
                                type="primary"
                                @click="jumpToOntConfig(item)"
                            >{{ getOntName(item) }}</el-link>
                        </template>-->
                        {{ getOntRange(scope.row) }}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 详情 -->
        <el-dialog :visible.sync="detailVisible" width="850px">
            <line-detail :data="rowData" @set-profile="setProfile"></line-detail>
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
        >
            <line-form
                :lineData="dialogData"
                :dbaData="dbaProfiles"
                :lineTable="lineTable"
                :type="dialogType"
                ref="line-form"
            ></line-form>
            <template slot="footer">
                <el-button @click="closeDialog">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('line-form')">{{ $lang('apply') }}</el-button>
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
            return this.lineProfs.slice(start, start + this.pageSize);
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
            bindingDevices: []
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
                            this.rowData = res.data.data;
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
                    isFunction(loading.close) && loading.close();
                });
        },
        showDetail(row) {
            this.getItem(row);
        },
        openDialog(type, data) {
            this.dialogType = type;
            this.setVisible = true;
            isDef(data) && (this.dialogData = data);
            this.$nextTick(_ => {
                this.$refs["line-form"].init();
            });
        },
        setProfile(data) {
            this.openDialog("set", data);
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (formData) {
                    const post_params = {
                        method: "add",
                        param: {
                            profname: formData.profname,
                            profid: formData.profid,
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
        getOntList(row) {
            return parseStringAsList(row.resource).map(item => ({
                port_id: row.port_id,
                ont_id: item
            }));
        },
        getOntName(item) {
            return `${this.getPortName(item.port_id)}/${
                item.ont_id < 10 ? "0" + item.ont_id : item.ont_id
            }`;
        },
        // item: { port_id: <number>, ont_id: <number> }
        jumpToOntConfig(item) {},
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
        }
    }
};
</script>

<style lang="less" scoped>
</style>