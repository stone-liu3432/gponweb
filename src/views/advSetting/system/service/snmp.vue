<template>
    <div>
        <h3>
            Trapserver
            <el-button
                type="primary"
                style="margin-left: 30px;"
                @click="openDialog('trap')"
            >{{ $lang('config') }}</el-button>
        </h3>
        <div class="service-snmp-trap">
            <div>
                <span>Server IP:</span>
                <span>{{ trap.serverip }}</span>
            </div>
            <div>
                <span>Trap Port:</span>
                <span>{{ trap.trap_port }}</span>
            </div>
            <div>
                <span>Trap Community:</span>
                <span>{{ trap.trap_community }}</span>
            </div>
        </div>
        <h3>
            Community
            <el-button
                type="primary"
                style="margin-left: 30px;"
                @click="openDialog('community')"
            >{{ $lang('config') }}</el-button>
        </h3>
        <div class="service-snmp-trap">
            <div>
                <span>Read Community:</span>
                <span>{{ community.read_community }}</span>
            </div>
            <div>
                <span>Write Community:</span>
                <span>{{ community.write_community }}</span>
            </div>
        </div>
        <el-dialog :title="$lang('config')" :visible.sync="dialogVisible" append-to-body>
            <snmp-form :type="dialogType" :base-data="dialogData" ref="service-snmp-form"></snmp-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('service-snmp-form')"
                >{{ $lang('apply') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import snmpForm from "./snmpForm";
import { isDef, isFunction } from "@/utils/common";
import postData from "@/mixin/postData";
export default {
    name: "serviceSnmp",
    mixins: [postData],
    components: { snmpForm },
    computed: {
        ...mapGetters(["$lang"])
    },
    props: {
        trap: {
            type: Object
        },
        community: {
            type: Object
        }
    },
    data() {
        return {
            dialogVisible: false,
            dialogType: "",
            dialogData: {}
        };
    },
    methods: {
        openDialog(type) {
            this.dialogType = type;
            this.dialogData = type === "trap" ? this.trap : this.community;
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["service-snmp-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(data => {
                if (isDef(data)) {
                    const ACTIONS = {
                        trap(data) {
                            return {
                                url: "/snmp_cfg?form=trap",
                                data: {
                                    method: "set",
                                    param: {
                                        serverip: data.serverip,
                                        trap_port: data.trap_port,
                                        trap_community: data.trap_community
                                    }
                                }
                            };
                        },
                        community(data) {
                            const flag = data.flag.reduce((pre, val) => {
                                return pre | val;
                            }, 0);
                            if (!flag) {
                                this.$message.warning(
                                    this.$lang("modify_tips")
                                );
                                return;
                            }
                            return {
                                url: "/snmp_cfg?form=community",
                                data: {
                                    method: "set",
                                    param: {
                                        flags: flag,
                                        read_community: data.read_community,
                                        write_community: data.write_community
                                    }
                                }
                            };
                        }
                    };
                    if (isFunction(ACTIONS[this.dialogType])) {
                        const result = ACTIONS[this.dialogType].call(
                            this,
                            data
                        );
                        if (isDef(result)) {
                            const { url, data: post_params } = result;
                            if (isDef(post_params) && isDef(url)) {
                                this.postData(url, post_params)
                                    .then(_ => {
                                        this.$emit("refresh");
                                    })
                                    .catch(_ => {});
                            }
                        }
                        this.dialogVisible = false;
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
h3 {
    color: @titleColor;
}
.service-snmp-trap {
    .base-font-style;
    margin: 20px 0 30px 0;
    > div {
        float: left;
        margin-left: 10px;
        & + div {
            margin-left: 120px;
        }
        span + span {
            margin-left: 12px;
        }
    }
    &:after {
        content: "";
        display: table;
        clear: both;
    }
}
</style>