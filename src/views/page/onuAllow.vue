<template>
    <div style="margin: 20px;">
        <page-header @port-change="portChange" type="pon">
            <div slot="title">{{ $lang('onu_allow') }}</div>
            <div slot="content">
                <el-button
                    type="primary"
                    style="margin-left: 30px;"
                    size="mini"
                    @click="openDialog()"
                >{{ $lang('add') }} ONT</el-button>
                <el-button
                    v-if="gpon_setting.length"
                    type="primary"
                    size="mini"
                    style="margin-left: 30px;"
                    @click="changeAutofindState"
                >{{ $lang(isAutofind ? 'off' : 'on', 'autofind') }}</el-button>
            </div>
        </page-header>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane :label="$lang('auth_list')" name="auth">
                <ont-auth-list :port_id="port_id" v-if="activeName === 'auth'" ref="ont-auth-list"></ont-auth-list>
            </el-tab-pane>
            <el-tab-pane :label="$lang('auto_discover_list')" name="autofind">
                <ont-auto-find
                    :port_id="port_id"
                    v-if="activeName === 'autofind'"
                    ref="auto-find-ont"
                    @add-ont="addOnt"
                ></ont-auto-find>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :title="$lang('config')" :visible.sync="dialogVisible" width="640px">
            <add-ont-form ref="add-ont-form" :port_id="port_id"></add-ont-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('add-ont-form')">{{ $lang('apply') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { isArray, isDef } from "@/utils/common";
import ontAuthList from "./onuAllow/ontAuthList";
import ontAutoFind from "./onuAllow/ontAutoFind";
import addOntForm from "./onuAllow/addOntForm";
import postData from "@/mixin/postData";
export default {
    name: "onuAllow",
    components: { ontAuthList, ontAutoFind, addOntForm },
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang"]),
        isAutofind() {
            const data = this.gpon_setting.filter(
                item => item.port_id === this.port_id
            )[0];
            if (data) {
                return data.autofind;
            }
            return 0;
        }
    },
    data() {
        return {
            port_id: 0,
            dialogVisible: false,
            activeName: "auth",
            dialogVisible: false,
            profs: {
                lineProfs: [],
                srvProfs: []
            },
            gpon_setting: []
        };
    },
    created() {
        this.getLineProfs();
        this.getSrvProfs();
        this.getStatus();
    },
    methods: {
        ...mapActions(["getLineProfs", "getSrvProfs"]),
        getStatus() {
            this.gpon_setting = [];
            this.$http
                .get("/gponmgmt?form=gpon_setting")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            if (isArray(res.data.data.gpon_setting)) {
                                this.gpon_setting = res.data.data.gpon_setting;
                            }
                        }
                    }
                })
                .catch(err => {});
        },
        portChange(port_id) {
            this.port_id = port_id;
        },
        addOnt(data) {
            this.openDialog(data);
        },
        openDialog(row) {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["add-ont-form"].init(row);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (formData) {
                    const url = `/gponont_mgmt?form=auth&port_id=${this.port_id}`,
                        post_params = {
                            method: "add",
                            param: {
                                identifier: formData.identifier,
                                auth_mode: formData.auth_mode,
                                ont_sn: formData.ont_sn,
                                loid: formData.loid,
                                loid_password: formData.loid_password,
                                ont_lineprofid: formData.ont_lineprofid,
                                ont_lineprofname: "",
                                ont_srvprofid: formData.ont_srvprofid,
                                ont_srvprofname: ""
                            }
                        };
                    this.postData(url, post_params)
                        .then(_ => {
                            this.$refs[
                                this.activeName === "auth"
                                    ? "ont-auth-list"
                                    : "auto-find-ont"
                            ].getData(this.port_id);
                        })
                        .catch(_ => {});
                    this.dialogVisible = false;
                }
            });
        },
        changeAutofindState() {
            this.$confirm(
                this.$lang(
                    "if_sure",
                    this.isAutofind ? "off" : "on",
                    "autofind"
                ) + " ?"
            )
                .then(_ => {
                    const url = `/gponmgmt?form=ont_autofind&port_id=${this.port_id}`;
                    const post_params = {
                        method: "set",
                        param: {
                            autofind: this.isAutofind ? 0 : 1
                        }
                    };
                    this.$http
                        .post(url, post_params)
                        .then(_ => {
                            this.getStatus();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        }
    },
    watch: {}
};
</script>

<style lang="less" scoped>
.collspace-title {
    margin: 0 12px 0 0;
    display: inline-block;
    vertical-align: middle;
    max-width: 25%;
    & + span {
        display: inline-block;
        vertical-align: middle;
        max-width: 75%;
        word-wrap: break-word;
        word-break: break-all;
        color: @titleColor;
    }
}
</style>