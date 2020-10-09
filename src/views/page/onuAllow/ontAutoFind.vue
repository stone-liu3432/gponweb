<template>
    <div>
        <div style="margin: 10px 0 20px 0;">
            <nms-filter
                inline
                :data="autofindList"
                :primary="filterable"
                @change="dataChange"
            ></nms-filter>
            <el-button type="primary" size="small" @click="changeBatch">
                <template v-if="!isBatch">{{ $lang("batch_config") }}</template>
                <template v-else>{{ $lang("exit_batch_onu") }}</template>
            </el-button>
            <template v-if="isBatch">
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="submitBatch"
                    >{{ $lang("delete") }}</el-button
                >
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="batchAddToAuthlist"
                    >{{ $lang("add_to_auth_list") }}</el-button
                >
            </template>
        </div>
        <el-table
            :data="showTable"
            border
            @selection-change="selectionChange"
            ref="ont-auto-find-table"
        >
            <template v-if="isBatch">
                <el-table-column type="selection"></el-table-column>
            </template>
            <el-table-column :label="$lang('ont_id')">
                <template slot-scope="scope">{{
                    `${getPortName((scope.row.identifier >> 8) & 0xff)}/${
                        scope.row.ont_id
                    }`
                }}</template>
            </el-table-column>
            <el-table-column
                :label="$lang('ont_sn')"
                prop="ont_sn"
            ></el-table-column>
            <el-table-column
                :label="$lang('ont_password')"
                prop="ont_password"
            ></el-table-column>
            <el-table-column
                :label="$lang('loid')"
                prop="loid"
            ></el-table-column>
            <el-table-column
                :label="$lang('loid_password')"
                prop="loid_password"
            ></el-table-column>
            <el-table-column
                :label="$lang('vendorid')"
                prop="vendorid"
            ></el-table-column>
            <el-table-column
                :label="$lang('ont_version')"
                prop="ont_version"
            ></el-table-column>
            <el-table-column
                :label="$lang('equipmentid')"
                prop="equipmentid"
            ></el-table-column>
            <el-table-column
                :label="$lang('autofind_time')"
                prop="autofind_time"
            ></el-table-column>
            <el-table-column :label="$lang('config')" width="180px">
                <template slot-scope="scope">
                    <el-button type="text" @click="addOntToAuth(scope.row)">{{
                        $lang("add_to_auth_list")
                    }}</el-button>
                    <el-button type="text" @click="deleteAutofind(scope.row)">{{
                        $lang("delete")
                    }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right; margin: 12px 0;"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filterableList.length"
            hide-on-single-page
        ></el-pagination>
        <el-dialog :visible="dialogVisible" append-to-body width="650px">
            <div slot="title">{{ $lang("config") }}</div>
            <auto-find-form ref="auto-find-form"></auto-find-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="submitBatchAdd('auto-find-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray } from "@/utils/common";
import postData from "@/mixin/postData";
import autoFindForm from "./autoFindForm";
export default {
    name: "ontAutoFind",
    components: { autoFindForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        showTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filterableList.slice(start, start + this.pageSize);
        },
        filterable() {
            return [
                {
                    prop: "ont_id",
                    value: 1,
                    label: this.$lang("ont_id")
                },
                {
                    prop: "ont_sn",
                    value: 2,
                    label: this.$lang("ont_sn")
                },
                {
                    prop: "loid",
                    value: 3,
                    label: this.$lang("loid")
                },
                {
                    prop: "vendorid",
                    value: 4,
                    label: this.$lang("vendorid")
                }
            ];
        }
    },
    mixins: [postData],
    props: {
        port_id: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            autofindList: [],
            currentPage: 1,
            pageSize: 10,
            isBatch: false,
            ontlist: [],
            dialogVisible: false,
            filterableList: []
        };
    },
    inject: ["updateNavScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateNavScrollbar();
        });
    },
    created() {
        this.getData(this.port_id);
    },
    methods: {
        getData(port_id) {
            this.autofindList = [];
            this.$http
                .get("/gponont_mgmt", {
                    params: {
                        form: "autofind",
                        port_id
                    }
                })
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            // const data = res.data.data.map(item => {
                            //     //item.ont_id = item.identifier & 0xff;
                            //     return item;
                            // });
                            this.autofindList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        addOntToAuth(row) {
            this.$emit("add-ont", row);
        },
        deleteAutofind(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    this.submitDelete([(this.port_id << 8) | row.ont_id]);
                })
                .catch(_ => {});
        },
        submitDelete(rows) {
            const data = {
                method: "delete",
                param: {
                    identifier: rows
                }
            };
            this.postData("/gponont_mgmt?form=autofind", data)
                .then(_ => {
                    this.getData(this.port_id);
                })
                .catch(_ => {});
        },
        changeBatch() {
            this.isBatch = !this.isBatch;
            // 退出时清空所有已选项
            if (!this.isBatch) {
                this.$refs["ont-auto-find-table"].clearSelection();
            }
        },
        selectionChange(rows) {
            this.ontlist = rows;
        },
        submitBatch() {
            if (!this.ontlist.length) {
                return this.$message.info(this.$lang("modify_tips"));
            }
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    const rows = this.ontlist.map(
                        item => (this.port_id << 8) | item.ont_id
                    );
                    rows.sort((a, b) => a - b);
                    this.submitDelete(rows);
                    this.changeBatch();
                })
                .catch(_ => {});
        },
        batchAddToAuthlist() {
            if (!this.ontlist.length) {
                return this.$message.info(this.$lang("modify_tips"));
            }
            this.$confirm(this.$lang("batch_add_to_authlist_tips"))
                .then(_ => {
                    this.dialogVisible = true;
                    this.$nextTick(_ => {
                        this.$refs["auto-find-form"].init();
                    });
                })
                .catch(_ => {});
        },
        submitBatchAdd(formName) {
            this.$refs[formName].validate(form => {
                const data = this.ontlist.map(item =>
                    item.ont_sn.slice(0, item.ont_sn.indexOf("("))
                );
                this.postData(
                    "/gponont_mgmt?form=multiauth&port_id=" + this.port_id,
                    {
                        method: "add",
                        param: {
                            ont_lineprofid: form.ont_lineprofid,
                            ont_lineprofname: "",
                            ont_srvprofid: form.ont_srvprofid,
                            ont_srvprofname: "",
                            ont_sn: data
                        }
                    }
                )
                    .then(_ => {
                        this.getData(this.port_id);
                    })
                    .catch(_ => {});
                this.dialogVisible = false;
                this.isBatch = false;
            });
        },
        dataChange(data) {
            this.filterableList = data;
        }
    },
    watch: {
        port_id() {
            this.getData(this.port_id);
        }
    }
};
</script>

<style lang="less" scoped>
</style>