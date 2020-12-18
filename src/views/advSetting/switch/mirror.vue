<template>
    <div>
        <page-header type="none">
            <template slot="title">{{ $lang("mirror") }}</template>
            <template slot="content">
                <el-button type="primary" size="mini" @click="refreshData">{{
                    $lang("refresh")
                }}</el-button>
            </template>
        </page-header>
        <el-table :data="mirrors" border>
            <el-table-column :label="$lang('src_port')" prop="port_id">
                <template slot-scope="scope">{{
                    getPortName(scope.row.port_id)
                }}</template>
            </el-table-column>
            <el-table-column :label="$lang('dst_port')" prop="dst_port">
                <template slot-scope="scope">{{
                    getPortName(scope.row.dst_port) || "-"
                }}</template>
            </el-table-column>
            <el-table-column :label="$lang('type')" prop="type">
                <template slot-scope="scope">
                    {{ $lang(PORT_MIRROR_TYPE_MAP[scope.row.type]) || "-" }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('config')" width="150px">
                <template slot-scope="scope">
                    <el-button type="text" @click="openDialog(scope.row)">{{
                        $lang("config")
                    }}</el-button>
                    <el-button
                        type="text"
                        style="margin-left: 20px"
                        @click="flushMirror(scope.row)"
                        >{{ $lang("flush") }}</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="dialogVisible"
            width="650px"
            append-to-body
            destroy-on-close
        >
            <template slot="title">{{ $lang("config") }}</template>
            <port-config-form
                type="mirror"
                :port_id="row.port_id"
                :data="row"
                ref="port-config-form"
            ></port-config-form>
            <template slot="footer">
                <el-button @click="dialogVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('port-config-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, debounce } from "@/utils/common";
import { PORT_MIRROR_TYPE_MAP } from "@/utils/commonData";
import portConfigForm from "./portConfig/form";
import postData from "@/mixin/postData";
export default {
    name: "mirror",
    components: { portConfigForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
    },
    mixins: [postData],
    data() {
        return {
            PORT_MIRROR_TYPE_MAP,
            mirrors: [],
            row: {},
            dialogVisible: false,
        };
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick((_) => {
            this.updateAdvMainScrollbar();
        });
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.mirrors = [];
            this.$http
                .get("/switch_port?form=mirror_all")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.mirrors = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        refreshData() {
            debounce(this.getData, 1000, this);
        },
        openDialog(row) {
            this.row = row;
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs["port-config-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((form) => {
                if (form) {
                    const url = "/switch_port?form=mirror",
                        data = {
                            method: "set",
                            param: {
                                src_port: form.src_port,
                                dst_port: form.dst_port,
                                type: form.type,
                            },
                        };
                    this.postData(url, data)
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
        flushMirror(row) {
            this.$confirm(this.$lang("if_sure", "flush", "mirror") + " ?")
                .then(() => {
                    this.postData("/switch_port?form=mirror", {
                        method: "clear",
                        param: {
                            src_port: row.port_id,
                        },
                    })
                        .then(() => {
                            this.getData();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
    },
};
</script>

<style lang="less" scoped>
</style>