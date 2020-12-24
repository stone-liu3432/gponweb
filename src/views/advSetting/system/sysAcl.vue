<template>
    <div>
        <page-header type="none">
            <template slot="title">{{ $lang("sys_acl") }}</template>
            <template slot="content">
                <el-button type="primary" size="small" @click="openDialog">
                    {{ $lang("add", "sys_acl") }}
                </el-button>
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px"
                    @click="refreshData"
                >
                    {{ $lang("refresh") }}
                </el-button>
            </template>
        </page-header>
        <el-table :data="sysAcls" border>
            <el-table-column
                :label="$lang('name')"
                prop="name"
            ></el-table-column>
            <el-table-column :label="$lang('afi')">
                <template slot-scope="scope">
                    {{ $lang(AFI_MAP[scope.row.afi]) }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('type')">
                <template slot-scope="scope">
                    {{ $lang(TYPES[scope.row.type]) }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$lang('hostip')"
                prop="hostip"
            ></el-table-column>
            <el-table-column
                :label="$lang('macaddr')"
                prop="macaddr"
            ></el-table-column>
            <el-table-column :label="$lang('access')">
                <template slot-scope="scope">
                    {{ SYSTEM_ACL_ACCESS_MAP[scope.row.access] }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('config')" width="80px">
                <template slot-scope="scope">
                    <el-button type="text" @click="deleteSysAcl(scope.row)">
                        {{ $lang("delete") }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            destroy-on-close
            width="550px"
        >
            <template slot="title">{{ $lang("add") }}</template>
            <sys-acl-form ref="sys-acl-form"></sys-acl-form>
            <template slot="footer">
                <el-button @click="dialogVisible = false">
                    {{ $lang("cancel") }}
                </el-button>
                <el-button type="primary" @click="submitForm('sys-acl-form')">
                    {{ $lang("apply") }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { SYSTEM_ACL_ACCESS_MAP, AFI_MAP } from "@/utils/commonData";
import { isArray, debounce } from "@/utils/common";
import postData from "@/mixin/postData";
import sysAclForm from "./sysAcl/sysAclForm";
export default {
    name: "sysAcl",
    components: { sysAclForm },
    computed: {
        ...mapGetters(["$lang"]),
    },
    mixins: [postData],
    data() {
        return {
            AFI_MAP,
            SYSTEM_ACL_ACCESS_MAP,
            TYPES: ["deny", "permit"],
            sysAcls: [],
            dialogVisible: false,
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.sysAcls = [];
            this.$http
                .get("/system_accesslist?form=rule_tab")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.sysAcls = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        deleteSysAcl(row) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(() => {
                    this.postData("/system_accesslist?form=rule_tab", {
                        method: "delete",
                        param: {
                            name: row.name,
                        },
                    })
                        .then(() => {
                            this.getData();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        refreshData() {
            debounce(this.getData, 1000, this);
        },
        openDialog() {
            this.dialogVisible = true;
        },
        submitForm(formName) {
            this.$refs[formName].validate((form) => {
                if (form) {
                    this.postData("/system_accesslist?form=rule_tab", {
                        method: "add",
                        param: {
                            name: form.name,
                            afi: form.afi,
                            type: form.type,
                            hostip: form.hostip,
                            macaddr: form.macaddr,
                            access: form.access,
                        },
                    })
                        .then(() => {
                            this.getData();
                        })
                        .catch(() => {})
                        .finally(() => {
                            this.dialogVisible = false;
                        });
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
</style>