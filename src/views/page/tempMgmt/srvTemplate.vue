<template>
    <div>
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
                        size="mini"
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
        <el-dialog
            :visible.sync="detailVisible"
            width="850px"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
        >
            <srv-detail :data="detail" @set-profile="setProfile"></srv-detail>
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
import { mapGetters } from "vuex";
import { isArray, isDef } from "@/utils/common";
import postData from "@/mixin/postData";
import srvDetail from "./srvTemplate/srvDetail";
import srvForm from "./srvTemplate/srvForm";
export default {
    name: "srvTemplate",
    mixins: [postData],
    components: { srvDetail, srvForm },
    computed: {
        ...mapGetters(["$lang"])
    },
    inject: ["updateNavScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateNavScrollbar();
        });
    },
    data() {
        return {
            srvTable: [],
            detailVisible: false,
            detail: {},
            setVisible: false,
            dialogType: "",
            dialogData: {}
        };
    },
    created() {
        this.getSrvTable();
    },
    methods: {
        getSrvTable() {
            this.srvTable = [];
            this.$http
                .get("/srvprofile?form=table")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.srvTable = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
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
                            this.detail = res.data.data;
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
                        this.getSrvTable();
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
            this.openDialog("set", data);
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
                            portvlan: formData.portvlan
                        }
                    };
                    this.postData("/srvprofile", post_param)
                        .then(_ => {
                            this.getSrvTable();
                            this.setVisible = false;
                        })
                        .catch(_ => {});
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>