<template>
    <div>
        <el-table
            border
            :data="baseData"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            style="width: 500px;"
        >
            <el-table-column label="Old VLAN" prop="old_vlan"></el-table-column>
            <el-table-column label="New VLAN" prop="new_vlan"></el-table-column>
            <el-table-column :label="$lang('new_vlan_pri')">
                <template slot-scope="scope">{{
                    scope.row.new_vlan_pri === 255
                        ? "-"
                        : scope.row.new_vlan_pri
                }}</template>
            </el-table-column>
            <el-table-column>
                <template slot="header">
                    <el-button @click="addPv">{{ $lang("add") }}</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        style="padding: 3px 0;"
                        @click="deletePv(scope.row)"
                        >{{ $lang("delete") }}</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <template slot="title">{{ $lang("add") }}</template>
            <vlan-translate-form
                ref="port-vlan-translate-form"
            ></vlan-translate-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{
                    $lang("cancel")
                }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('port-vlan-translate-form')"
                    >{{ $lang("apply") }}</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import vlanTranslateForm from "./vlanTranslateForm";
import postData from "@/mixin/postData";
export default {
    name: "vlanTranslate",
    mixins: [postData],
    components: { vlanTranslateForm },
    props: {
        baseData: {
            type: Array,
            required: true
        },
        port_id: {
            type: Number,
            required: true
        }
    },
    computed: {
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            dialogVisible: false
        };
    },
    created() {},
    methods: {
        addPv() {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["port-vlan-translate-form"].init();
            });
        },
        deletePv(data) {
            this.$confirm(this.$lang("if_sure", "delete") + "?")
                .then(_ => {
                    const post_params = {
                        method: "delete",
                        param: {
                            port_id: data.port_id,
                            old_vlan: data.old_vlan,
                            old_vlan_s: 0,
                            old_vlan_e: 0,
                            action: 0
                        }
                    };
                    this.postData("/vlan_action?form=translate", post_params)
                        .then(_ => {
                            this.$emit("refresh", data.port_id);
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        submitForm(formName) {
            this.$refs[formName].validate(data => {
                if (data) {
                    const post_params = {
                        method: "set",
                        param: {
                            port_id: this.port_id,
                            old_vlan: data.old_vlan,
                            new_vlan: data.new_vlan,
                            new_vlan_pri: data.new_vlan_pri,
                            action: 0
                        }
                    };
                    this.postData("/vlan_action?form=translate", post_params)
                        .then(_ => {
                            this.$emit("refresh", this.port_id);
                        })
                        .catch(_ => {});
                    this.dialogVisible = false;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>