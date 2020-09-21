<template>
    <div>
        <div class="dhcp-option82-item">
            <span>{{ $lang('option82_admin') }}:</span>
            <span>{{ $lang(SWITCH[data.option82_admin]) }}</span>
            <el-button
                type="primary"
                size="small"
                @click="chagneOption82Admin"
            >{{ $lang(BUTTON_TEXT[data.option82_admin]) }}</el-button>
        </div>
        <template v-if="data.option82_admin">
            <div class="dhcp-option82-item">
                <span>{{ $lang('option82_policy') }}:</span>
                <span>{{ $lang(OPTION82_POLICY[data.option82_policy]) }}</span>
                <el-button
                    type="primary"
                    size="small"
                    @click="openDialog('policy')"
                >{{ $lang('config') }}</el-button>
            </div>
            <div class="dhcp-option82-item">
                <span>{{ $lang('option82_circuit') }}:</span>
                <span>{{ OPTION82_CIRCUIT[data.option82_circuit] }}</span>
            </div>
            <div class="dhcp-option82-item">
                <span>{{ $lang('option82_remote') }}:</span>
                <span>{{ OPTION82_REMOTE[data.option82_remote] }}</span>
            </div>
        </template>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="650px">
            <div slot="title"></div>
            <dhcp-option82-form ref="dhcp-option82-form"></dhcp-option82-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('dhcp-option82-form')"
                >{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
    SWITCH,
    BUTTON_TEXT,
    OPTION82_POLICY,
    OPTION82_CIRCUIT,
    OPTION82_REMOTE
} from "@/utils/commonData";
import postData from "@/mixin/postData";
import dhcpOption82Form from "./option82Form";
import { isFunction } from "@/utils/common";
export default {
    name: "dhcpOption82",
    computed: {
        ...mapGetters(["$lang"])
    },
    components: { dhcpOption82Form },
    props: {
        data: {
            type: Object
        }
    },
    mixins: [postData],
    inject: ["updateAdvMainScrollbar"],
    mounted() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            SWITCH,
            BUTTON_TEXT,
            OPTION82_POLICY,
            OPTION82_CIRCUIT,
            OPTION82_REMOTE,
            dialogVisible: false
        };
    },
    methods: {
        chagneOption82Admin() {
            this.$confirm(
                this.$lang("if_sure", BUTTON_TEXT[this.data.option82_admin]) +
                    " Option82 ?"
            )
                .then(_ => {
                    const url = "/switch_dhcp?form=option82_admin",
                        post_param = {
                            method: "set",
                            param: {
                                option82_admin: Number(
                                    !this.data.option82_admin
                                )
                            }
                        };
                    this.postData(url, post_param)
                        .then(_ => {
                            this.$emit("refresh-data");
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        openDialog(type) {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["dhcp-option82-form"].init(type, this.data);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((type, formData) => {
                if (formData) {
                    const ACTIONS = {
                        policy(form) {
                            if (
                                form.option82_policy ===
                                this.data.option82_policy
                            ) {
                                this.$message.info(this.$lang("modify_tips"));
                                return;
                            }
                            return {
                                url: "/switch_dhcp?form=option82_policy",
                                data: {
                                    method: "set",
                                    param: {
                                        option82_policy: form.option82_policy
                                    }
                                }
                            };
                        }
                    };
                    if (isFunction(ACTIONS[type])) {
                        const res = ACTIONS[type].call(this, formData);
                        if (res) {
                            const { url, data } = res;
                            url &&
                                data &&
                                this.postData(url, data)
                                    .then(_ => {
                                        this.$emit("refresh-data");
                                    })
                                    .catch(_ => {});
                            this.dialogVisible = false;
                        }
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.dhcp-option82-item {
    .base-font-style;
    margin: 20px 0;
    > span {
        display: inline-block;
        vertical-align: middle;
    }
    > span + span {
        margin: 0 30px 0 20px;
    }
}
</style>