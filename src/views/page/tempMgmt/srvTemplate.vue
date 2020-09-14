<template>
    <div>
        <nms-filter
            style="margin-left: 10px;"
            :data="srvProfs"
            :primary="filterable"
            @change="dataChange"
        ></nms-filter>
        <el-table :data="srvTable" border>
            <el-table-column prop="profname" :label="$lang('profname')"></el-table-column>
            <el-table-column prop="profid" :label="$lang('profid')"></el-table-column>
            <el-table-column prop="bindtimes" :label="$lang('bindtimes')"></el-table-column>
            <el-table-column width="200px">
                <template slot="header">
                    <span>{{ $lang('config') }}</span>
                    <el-button
                        type="primary"
                        style="margin-left: 30px;"
                        size="small"
                        @click="openDialog('add')"
                    >{{ $lang('add') }}</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button type="text" @click="showDetail(scope.row)">{{ $lang('show_detail') }}</el-button>
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
            :total="filterableList.length"
            hide-on-single-page
        ></el-pagination>
        <el-dialog
            :visible.sync="detailVisible"
            width="850px"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :before-close="beforeClose"
        >
            <srv-detail :data="detail" ref="srv-detail" @set-profile="setProfile"></srv-detail>
        </el-dialog>
        <el-dialog :visible.sync="setVisible" width="640px" append-to-body>
            <template slot="title">{{ $lang(dialogType) }}</template>
            <srv-form :type="dialogType" :data="dialogData" ref="srv-form"></srv-form>
            <div slot="footer">
                <el-button @click="setVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('srv-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { isArray, isDef } from "@/utils/common";
import postData from "@/mixin/postData";
import srvDetail from "./srvTemplate/srvDetail";
import srvForm from "./srvTemplate/srvForm";
export default {
    name: "srvTemplate",
    mixins: [postData],
    components: { srvDetail, srvForm },
    computed: {
        ...mapState(["srvProfs"]),
        ...mapGetters(["$lang"]),
        srvTable() {
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
    inject: ["updateNavScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateNavScrollbar();
        });
    },
    data() {
        return {
            detailVisible: false,
            detail: {},
            setVisible: false,
            dialogType: "",
            dialogData: {},
            currentPage: 1,
            pageSize: 10,
            filterableList: []
        };
    },
    created() {
        this.getSrvProfs();
    },
    methods: {
        ...mapActions(["getSrvProfs"]),
        showDetail(row) {
            this.getDetail(row);
        },
        getDetail(row) {
            let loading = this.$loading();
            this.detail = {};
            const url = `/srvprofile?form=self&profid=${row.profid}&profname=${row.profname}`;
            this.$http
                .get(url)
                .then(res => {
                    loading.close();
                    loading = null;
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            const detail = res.data.data;
                            if (!detail.portvlan) {
                                detail.portvlan = [];
                            }
                            this.detail = detail;
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
                .catch(err => {});
        },
        deleteProf(row) {
            this.$confirm(
                `${this.$lang("if_sure", "delete")} ${row.profname} ?`
            )
                .then(_ => {
                    const post_param = {
                        method: "delete",
                        param: {
                            profname: row.profname,
                            profid: row.profid
                        }
                    };
                    this.postData("/srvprofile", post_param).then(_ => {
                        this.getSrvProfs();
                    });
                })
                .catch(_ => {});
        },
        openDialog(type, data) {
            if (isDef(data)) {
                this.dialogData = data;
            }
            this.dialogType = type;
            this.setVisible = true;
            this.$nextTick(_ => {
                this.$refs["srv-form"].init();
            });
        },
        setProfile(data) {
            this.postProfile(data)
                .then(_ => {
                    this.getSrvProfs();
                    this.detailVisible = false;
                })
                .catch(_ => {});
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (formData) {
                    const post_param = {
                        method: this.dialogType,
                        param: {
                            profname: formData.profname,
                            profid: formData.profid,
                            ont_ethport: formData.ont_ethport,
                            ont_potsport: formData.ont_potsport,
                            ont_catvport: formData.ont_catvport,
                            native_vlan_flag: formData.native_vlan_flag,
                            portvlan: formData.portvlan,
                            ont_veipport: formData.ont_veipport
                        }
                    };
                    this.postProfile(post_param)
                        .then(_ => {
                            this.getSrvProfs();
                            this.setVisible = false;
                        })
                        .catch(_ => {});
                }
            });
        },
        postProfile(params) {
            return this.postData("/srvprofile", params);
        },
        beforeClose(done) {
            const comp = this.$refs["srv-detail"];
            if (!comp.modifyFlags) {
                done();
            } else {
                this.$confirm(this.$lang("unsave_info"))
                    .then(_ => {
                        comp.saveAllChanges(false);
                    })
                    .catch(_ => {
                        done();
                    });
            }
        },
        dataChange(data) {
            this.filterableList = data;
        }
    }
};
</script>

<style lang="less" scoped>
</style>