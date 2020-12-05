<template>
    <div>
        <page-header type="pon" @port-change="portChange">
            <template slot="title">{{ $lang("onu_deny") }}</template>
            <template slot="content">
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
        <div class="ont-deny-actions">
            <el-button
                type="primary"
                size="small"
                style="margin-left: 10px"
                @click="openDialog"
            >
                {{ $lang("add") }} ONT
            </el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                @click="deleteDeny"
            >
                {{ $lang("delete") }} ONT
            </el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px"
                @click="clearDeny"
            >
                {{ $lang("clear") }}
            </el-button>
        </div>
        <el-table :data="denyList" border @selection-change="selectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column :label="$lang('port_id')">
                <template slot-scope="scope">
                    {{ getPortName(scope.row.port_id) }}
                </template>
            </el-table-column>
            <el-table-column :label="$lang('ont_id')">
                <template slot-scope="scope">
                    {{ `${scope.row.port_id} / ${scope.row.ont_id}` }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$lang('ont_sn')"
                prop="ont_sn"
            ></el-table-column>
            <el-table-column
                :label="$lang('trycount')"
                prop="trycount"
            ></el-table-column>
            <el-table-column
                :label="$lang('reason')"
                prop="reason"
            ></el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            destroy-on-close
            width="550px"
        >
            <template slot="title">{{ $lang("add", "onu_deny") }}</template>
            <deny-form ref="deny-form"></deny-form>
            <template slot="footer">
                <el-button @click="dialogVisible = false">
                    {{ $lang("cancel") }}
                </el-button>
                <el-button type="primary" @click="submitForm('deny-form')">
                    {{ $lang("apply") }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isArray, debounce } from "@/utils/common";
import postData from "@/mixin/postData";
import denyForm from "./ontDeny/form";
export default {
    name: "ontDeny",
    components: { denyForm },
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
    },
    mixins: [postData],
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(() => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            port_id: 0,
            denyList: [],
            selection: [],
            dialogVisible: false,
        };
    },
    methods: {
        portChange(port_id) {
            this.port_id = port_id;
            this.getData(port_id);
        },
        getData(port_id) {
            this.denyList = [];
            this.$http
                .get(`/gponont_mgmt?form=blont&port_id=${port_id}`)
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.denyList = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        refreshData() {
            debounce(this.getData, 1000, this, this.port_id);
        },
        selectionChange(selection) {
            this.selection = selection;
        },
        deleteDeny() {
            if (!this.selection.length) {
                return this.$message.error(this.$lang("no_select_onu"));
            }
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(() => {
                    this.postData("/gponont_mgmt?form=blont", {
                        method: "delete",
                        param: {
                            port_id: this.port_id,
                            ont_sn: this.selection.map((item) => item.ont_sn),
                        },
                    })
                        .then(() => {
                            this.getData(this.port_id);
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        clearDeny() {
            this.$confirm(this.$lang("if_sure", "clear") + " ?")
                .then(() => {
                    this.postData("/gponont_mgmt?form=blont", {
                        method: "clear",
                        param: {
                            port_id: this.port_id,
                            ont_sn: [],
                        },
                    })
                        .then(() => {
                            this.getData(this.port_id);
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        openDialog() {
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs["deny-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((form) => {
                if (form) {
                    this.postData("/gponont_mgmt?form=blont", {
                        method: "add",
                        param: {
                            port_id: this.port_id,
                            ont_sn: form.ont_sn,
                            reason: form.reason,
                        },
                    })
                        .then(() => {
                            this.getData(this.port_id);
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
.ont-deny-actions {
    margin: 0 0 20px 0;
}
</style>