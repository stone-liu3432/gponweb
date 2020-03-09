<template>
    <div style="margin: 20px;">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane :label="$lang('dba_profile')" name="dba">
                <dba-template
                    :dbaProfiles="dbaProfiles"
                    @refreshData="getDbaProf"
                    v-if="activeName === 'dba'"
                ></dba-template>
            </el-tab-pane>
            <el-tab-pane :label="$lang('line_profile')" name="line">
                <line-template
                    @refreshData="getDbaProf"
                    :dbaProfiles="dbaProfiles"
                    v-if="activeName === 'line'"
                ></line-template>
            </el-tab-pane>
            <el-tab-pane :label="$lang('srv_profile')" name="srv">
                <srv-template v-if="activeName === 'srv'"></srv-template>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import dbaTemplate from "./tempMgmt/dbaTemplate";
import lineTemplate from "./tempMgmt/lineTemplate";
import srvTemplate from "./tempMgmt/srvTemplate";
import { isArray } from "@/utils/common";
export default {
    name: "templateMgmt",
    components: { dbaTemplate, lineTemplate, srvTemplate },
    computed: {
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            activeName: "dba",
            dbaProfiles: []
        };
    },
    methods: {
        getDbaProf() {
            this.dbaProfiles = [];
            this.$http
                .get("/dbaprofile?form=table")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.dbaProfiles = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        }
    }
};
</script>

<style lang="less" scoped>
</style>