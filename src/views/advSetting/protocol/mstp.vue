<template>
    <div>
        <page-header type="none" :title="$lang('mstp')"></page-header>
        <div class="mstp-global-status">
            <span>{{ $lang('mstp_status') }}:</span>
            <span>{{ SWITCH[mstp_status] }}</span>
            <el-button
                type="primary"
                size="small"
                @click="changeMstpState"
            >{{ $lang(BUTTON_TEXT[mstp_status]) }}</el-button>
        </div>
        <template v-if="mstp_status">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane :label="$lang('mstp_region')" name="mstp_region">
                    <mstp-region ref="mstp-region" v-if="activeName === 'mstp_region'"></mstp-region>
                </el-tab-pane>
                <el-tab-pane :label="$lang('cist')" name="cist">
                    <mstp-cist ref="mstp-cist" v-if="activeName === 'cist'"></mstp-cist>
                </el-tab-pane>
                <el-tab-pane :label="$lang('msti')" name="msti">
                    <mstp-msti ref="mstp-msti" v-if="activeName === 'msti'"></mstp-msti>
                </el-tab-pane>
                <el-tab-pane :label="$lang('port_cfg')" name="port_cfg">
                    <mstp-port ref="mstp-port" v-if="activeName === 'port_cfg'"></mstp-port>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef } from "@/utils/common";
import { SWITCH, BUTTON_TEXT } from "@/utils/commonData";
import postData from "@/mixin/postData";
import mstpRegion from "./mstp/region";
import mstpCist from "./mstp/cist";
import mstpMsti from "./mstp/msti";
import mstpPort from "./mstp/port";
export default {
    name: "mstp",
    computed: {
        ...mapGetters(["$lang"])
    },
    components: { mstpRegion, mstpCist, mstpMsti, mstpPort },
    data() {
        return {
            SWITCH,
            BUTTON_TEXT,
            mstp_status: 0,
            tabs: ["mstp_region", "cist", "msti", "port_cfg"],
            activeName: "mstp_region"
        };
    },
    created() {
        this.getStatus();
    },
    mixins: [postData],
    methods: {
        getStatus() {
            this.mstp_status = 0;
            this.$http
                .get("/switch_mstp?form=mstp_status")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.mstp_status = res.data.data.mstp_status || 0;
                        }
                    }
                })
                .catch(_ => {});
        },
        changeMstpState() {
            this.$confirm(
                this.$lang("if_sure", this.BUTTON_TEXT[this.mstp_status]) +
                    " MSTP ?"
            )
                .then(_ => {
                    this.postData("/switch_mstp?form=mstp_status", {
                        method: "set",
                        param: {
                            mstp_status: Number(!this.mstp_status)
                        }
                    })
                        .then(_ => {
                            this.getStatus();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        }
    }
};
</script>

<style lang="less" scoped>
.mstp-global-status {
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