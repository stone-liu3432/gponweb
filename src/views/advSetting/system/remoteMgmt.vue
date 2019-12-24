<template>
    <div>
        <page-header :title="$lang('remote_mgmt')" type="none"></page-header>
        <template v-if="!!outbound">
            <remote-card :type="dialogType" :bound-data="outbound" @handle-config="setBound"></remote-card>
        </template>
        <h3>
            {{ $lang('inbound') }}
            <el-button
                plain
                type="primary"
                style="margin-left: 30px;"
                @click="setBound(null, 'inbound', 'add')"
            >{{ $lang('add', 'inbound') }}</el-button>
        </h3>
        <template v-for="item in inbound">
            <remote-card :type="dialogType" :bound-data="item" @handle-config="setBound"></remote-card>
        </template>
        <el-dialog :visible.sync="dialogVisible" :before-close="closeDialog">
            <template slot="title">{{ $lang(dialogType === 'add' ? 'add' : 'set') }}</template>
            <remote-form :type="dialogType" :form-data="formData" ref="remote-form"></remote-form>
            <span slot="footer">
                <el-button @click="closeDialog">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('remote-form')">{{ $lang('apply') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import remoteCard from "./remote/remoteCard";
import remoteForm from "./remote/remoteForm";
import { isDef, isFunction } from "@/utils/common";
import postData from "@/mixin/postData";
export default {
    name: "remoteMgmt",
    components: { remoteCard, remoteForm },
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang"]),
        ...mapState(["interfaces"]),
        inbound() {
            return this.interfaces.filter(
                item => item.interface !== "outbound"
            );
        },
        outbound() {
            return this.interfaces.filter(
                item => item.interface === "outbound"
            )[0];
        }
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            dialogVisible: false,
            dialogType: "",
            post_url: "",
            formData: {}
        };
    },
    created() {
        this.getInterfaces();
    },
    methods: {
        ...mapActions(["getInterfaces"]),
        setBound(data, type, action) {
            this.dialogType = action;
            this.formData = data;
            const ACTIONS = {
                outbound: {
                    config(data) {
                        this.post_url = "/system?form=outbound";
                        this.dialogVisible = true;
                    }
                },
                inbound: {
                    config(data) {
                        this.post_url = "/system?form=inbound";
                        this.dialogVisible = true;
                    },
                    add() {
                        this.post_url = "/system?form=inbound";
                        this.dialogVisible = true;
                        this.formData = {};
                    },
                    delete(data) {
                        const post_params = {
                            method: "delete",
                            param: {
                                interface: data.interface,
                                vlan_id: data.vlan_id
                            }
                        };
                        this.$confirm(this.$lang("if_sure", "delete"))
                            .then(_ => {
                                this.postData(
                                    "/system?form=inbound",
                                    post_params
                                )
                                    .then(_ => {
                                        this.getInterfaces();
                                    })
                                    .catch(_ => {});
                            })
                            .catch(_ => {});
                    }
                }
            };
            if (isDef(ACTIONS[type]) && isFunction(ACTIONS[type][action])) {
                ACTIONS[type][action].call(this, data);
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(data => {
                if (data) {
                    const {
                        ipaddr,
                        ipmask,
                        vlan_id,
                        interface: _interface
                    } = data;
                    const post_params = {
                        method: this.dialogType === "config" ? "set" : "add",
                        param: {
                            ipaddr,
                            ipmask,
                            vlan_id,
                            // undefined，JSON化时将会忽略此参数
                            interface: _interface || undefined
                        }
                    };
                    this.postData(this.post_url, post_params)
                        .then(_ => {
                            this.getInterfaces();
                        })
                        .catch(_ => {});
                    this.closeDialog();
                }
            });
        },
        closeDialog(fn) {
            this.dialogVisible = false;
            this.$nextTick(_ => {
                this.dialogType = "";
                this.formData = null;
            });
            if (isFunction(fn)) {
                fn();
            }
        }
    }
};
</script>

<style lang="less" scoped>
h3 {
    color: @titleColor;
}
</style>