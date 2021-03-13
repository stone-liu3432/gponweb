<template>
    <div>
        <div style="margin: 12px">
            <el-button type="primary" size="small" @click="refreshData">{{
                $lang("refresh")
            }}</el-button>
        </div>
        <el-table :data="showList" border>
            <el-table-column
                :label="$lang('svp_af_id')"
                prop="svp_af_id"
            ></el-table-column>
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">{{
                    getPortName(scope.row.port_id)
                }}</template>
            </el-table-column>
            <el-table-column
                :label="$lang('ont_id')"
                prop="ont_id"
            ></el-table-column>
            <el-table-column
                :label="$lang('gemport')"
                prop="gemport"
            ></el-table-column>
            <el-table-column :label="$lang('user_vlan')" prop="user_vlan">
                <template slot-scope="scope">
                    {{
                        scope.row.user_vlan === 0
                            ? "untag"
                            : scope.row.user_vlan === 0xfffe
                            ? "transparent"
                            : scope.row.user_vlan
                    }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button type="text" @click="openDialog(scope.row)">{{
                        $lang("add", "virtual_port")
                    }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page.sync="currentPage"
            style="float: right; margin: 12px 0"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="findList.length"
            hide-on-single-page
        ></el-pagination>
        <el-dialog :visible.sync="dialogVisible" width="640px">
            <span slot="title">{{ $lang("add") }}</span>
            <add-vp-from-af-form
                ref="add-vp-from-af-form"
            ></add-vp-from-af-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('add-vp-from-af-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, debounce } from "@/utils/common";
import addVpFromAfForm from "./addVpFromAutofind";
import postData from "@/mixin/postData";
export default {
    name: "autoFindList",
    components: { addVpFromAfForm },
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        showList() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.findList.slice(start, start + this.pageSize);
        },
    },
    inject: ["updateNavScrollbar"],
    updated() {
        this.$nextTick((_) => {
            this.updateNavScrollbar();
        });
    },
    data() {
        return {
            findList: [],
            currentPage: 1,
            pageSize: 10,
            dialogVisible: false,
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.findList = [];
            this.$http
                .get("/switch_svp?form=svp_auto_find")
                .then((res) => {
                    if (res.data.code === 1) {
                        this.$http
                            .get("/serviceport_af")
                            .then((res) => {
                                if (res.data.code === 1) {
                                    if (isArray(res.data.data)) {
                                        this.findList = res.data.data;
                                    }
                                }
                            })
                            .catch((err) => {});
                    }
                })
                .catch((err) => {});
        },
        openDialog(row) {
            this.dialogVisible = true;
            this.$nextTick((_) => {
                this.$refs["add-vp-from-af-form"].init(row);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((formData) => {
                if (formData) {
                    const url = "/switch_svp?form=svp_af_create",
                        data = {
                            method: "add",
                            param: {
                                svp_af_id: formData.svp_af_id,
                                new_svlan: formData.new_svlan,
                                tag_action: formData.tag_action,
                                inner_vlan: formData.inner_vlan || 0,
                            },
                        };
                    this.postData(url, data)
                        .then((_) => {
                            this.getData();
                            this.dialogVisible = false;
                        })
                        .catch((_) => {});
                }
            });
        },
        refreshData() {
            debounce(this.getData, 1000, this);
        },
    },
};
</script>

<style lang="less" scoped>
</style>