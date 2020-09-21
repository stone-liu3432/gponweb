<template>
    <div>
        <nms-panel
            :data="info"
            :layout="[6, 18]"
            :excludes="excludes"
            :contentRender="contentRender"
        >
            <div slot="title">
                <span>{{ $lang('igmp', 'info') }}</span>
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="openDialog"
                >{{ $lang('config') }}</el-button>
            </div>
        </nms-panel>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="650px">
            <div slot="title">{{ $lang('config') }}</div>
            <igmp-info-form ref="igmp-info-form"></igmp-info-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('igmp-info-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef } from "@/utils/common";
import { IGMP_MODES, IGMP_PROTOCOL_POLICIES, SWITCH } from "@/utils/commonData";
import igmpInfoForm from "./igmpInfoForm";
import postData from "@/mixin/postData";
export default {
    name: "igmpInfo",
    components: { igmpInfoForm },
    computed: {
        ...mapGetters(["$lang"]),
        excludes() {
            const EXCLUDES = [
                [
                    "fast_leave",
                    "protocol_policy",
                    "group_aging_time",
                    "robustness",
                    "query_src_ip",
                    "query_src_mac",
                    "gen_response_time",
                    "gen_query_interval",
                    "sp_response_time",
                    "sp_query_interval",
                    "sp_query_number"
                ],
                [
                    "robustness",
                    "query_src_ip",
                    "query_src_mac",
                    "gen_response_time",
                    "gen_query_interval",
                    "sp_response_time",
                    "sp_query_interval",
                    "sp_query_number"
                ],
                ["group_aging_time"]
            ];
            return EXCLUDES[this.info.mode >>> 0];
        }
    },
    mixins: [postData],
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            info: {},
            contentRender: {
                mode(key, val) {
                    return IGMP_MODES[val];
                },
                fast_leave(key, val) {
                    return SWITCH[val];
                },
                protocol_policy(key, val) {
                    return IGMP_PROTOCOL_POLICIES[val];
                },
                group_aging_time(key, val) {
                    return `${val} s`;
                },
                gen_response_time(key, val) {
                    return `${val} s`;
                },
                gen_query_interval(key, val) {
                    return `${val} s`;
                },
                sp_response_time(key, val) {
                    return `${val} ms`;
                },
                sp_query_interval(key, val) {
                    return `${val} ms`;
                }
            },
            dialogVisible: false
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.info = {};
            this.$http
                .get("/switch_igmp?form=config")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.info = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        openDialog() {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["igmp-info-form"].init(this.info);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(data => {
                if (data) {
                    if (this.info.mode !== data.mode) {
                        this.changeMode(data);
                    } else {
                        if (data.flags) {
                            this.submitChange(data);
                        } else {
                            this.$message.info(this.$lang("modify_tips"));
                        }
                    }
                }
            });
        },
        changeMode(data) {
            const url = "/switch_igmp?form=mode",
                post_params = {
                    method: "set",
                    param: {
                        mode: data.mode
                    }
                };
            this.postData(url, post_params, false)
                .then(_ => {
                    if (data.mode !== 0) {
                        this.submitChange(data);
                    } else {
                        this.$message.success(this.$lang("setting_ok"));
                        this.dialogVisible = false;
                        this.getData();
                    }
                })
                .catch(_ => {});
        },
        submitChange(data) {
            const url = "/switch_igmp?form=config",
                post_params = {
                    method: "set",
                    param: {
                        flags: data.flags,
                        protocol_policy: data.protocol_policy,
                        fast_leave: data.fast_leave,
                        group_aging_time: data.group_aging_time,
                        robustness: data.robustness,
                        gen_response_time: data.gen_response_time,
                        gen_query_interval: data.gen_query_interval,
                        query_src_ip: data.query_src_ip,
                        query_src_mac: data.query_src_mac,
                        sp_query_interval: data.sp_query_interval,
                        sp_response_time: data.sp_response_time,
                        sp_query_number: data.sp_query_number
                    }
                };
            this.postData(url, post_params)
                .then(_ => {
                    this.getData();
                })
                .catch(_ => {});
            this.dialogVisible = false;
        }
    }
};
</script>

<style lang="less" scoped>
</style>