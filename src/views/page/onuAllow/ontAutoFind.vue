<template>
    <div>
        <el-table :data="showTable" border stripe>
            <el-table-column :label="$lang('ont_id')">
                <template
                    slot-scope="scope"
                >{{ `${getPortName((scope.row.identifier >> 8) & 0xff)}/${(scope.row.identifier) & 0xff}` }}</template>
            </el-table-column>
            <el-table-column :label="$lang('ont_sn')" prop="ont_sn"></el-table-column>
            <el-table-column :label="$lang('ont_password')" prop="ont_password"></el-table-column>
            <el-table-column :label="$lang('loid')" prop="loid"></el-table-column>
            <el-table-column :label="$lang('loid_password')" prop="loid_password"></el-table-column>
            <el-table-column :label="$lang('vendorid')" prop="vendorid"></el-table-column>
            <el-table-column :label="$lang('ont_version')" prop="ont_version"></el-table-column>
            <el-table-column :label="$lang('equipmentid')" prop="equipmentid"></el-table-column>
            <el-table-column :label="$lang('autofind_time')" prop="autofind_time"></el-table-column>
            <el-table-column :label="$lang('config')" width="180px">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="addOntToAuth(scope.row)"
                    >{{ $lang('add_to_auth_list') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right; margin: 12px 0;"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="autofindList.length"
            hide-on-single-page
        ></el-pagination>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray } from "@/utils/common";
export default {
    name: "ontAutoFind",
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        showTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.autofindList.slice(start, start + this.pageSize);
        }
    },
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
            pageSize: 10
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
                            this.autofindList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        addOntToAuth(row) {
            this.$emit("add-ont", row);
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