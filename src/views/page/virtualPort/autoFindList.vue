<template>
    <div>
        <el-table :data="showList" border>
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">{{ getPortName(scope.row.port_id) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('ont_id')" prop="ont_id"></el-table-column>
            <el-table-column :label="$lang('gemport')" prop="gemport"></el-table-column>
            <el-table-column :label="$lang('user_vlan')" prop="user_vlan"></el-table-column>
            <el-table-column :label="$lang('config')">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="openDialog(scope.row)"
                    >{{ $lang('add', 'virtual_port') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page.sync="currentPage"
            style="float: right; margin: 12px 0;"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="findList.length"
            hide-on-single-page
        ></el-pagination>
        <el-dialog :visible.sync="dialogVisible" width="640px">
            <span slot="title"></span>
            <virtual-port-form type="add" :data="dialogData" ref="virtual-port-form"></virtual-port-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('virtual-port-form')"
                >{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray } from "@/utils/common";
import virtualPortForm from "./virtualPortForm";
import postData from "@/mixin/postData";
export default {
    name: "autoFindList",
    components: { virtualPortForm },
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        showList() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.findList.slice(start, start + this.pageSize);
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
            findList: [],
            currentPage: 1,
            pageSize: 10,
            dialogVisible: false,
            dialogData: {}
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
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.findList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        openDialog(row) {
            this.dialogData = row;
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["virtual-port-form"].init(form => {
                    Object.keys(form).forEach(key => {
                        key in row && (form[key] = row[key]);
                    });
                });
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (formData) {
                    const url = "/switch_svp?form=svp_create",
                        data = {
                            method: "add",
                            param: {
                                svp_id: formData.svp_id,
                                svlan: formData.svlan,
                                port_id: formData.port_id,
                                ont_id: formData.ont_id,
                                gemport: formData.gemport,
                                user_vlan: formData.user_vlan,
                                tag_action: formData.tag_action,
                                inner_vlan: formData.inner_vlan
                            }
                        };
                    this.postData(url, data)
                        .then(_ => {
                            this.getData();
                            this.dialogVisible = false;
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