<template>
    <div>
        <h3>
            FRPC
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                v-if="Object.keys(baseData).length"
                @click="openDialog"
            >{{ $lang('config') }}</el-button>
        </h3>
        <template v-if="Object.keys(baseData).length">
            <template v-for="(item, key) in baseData">
                <el-row class="service-frpc-item">
                    <el-col
                        :span="4"
                        style="text-transform: capitalize;"
                    >{{ key === 'local_ip' ? 'Local IP' : key.replace(/_/, ' ') }}</el-col>
                    <el-col :span="20">{{ key === 'type' ? type_maps[item] : item }}</el-col>
                </el-row>
            </template>
        </template>
        <el-dialog
            :title="$lang('config')"
            :visible.sync="dialogVisible"
            append-to-body
            width="500px"
        >
            <frpc-form :frpc="baseData" ref="service-frpc-form"></frpc-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('service-frpc-form')"
                >{{ $lang('apply') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import frpcForm from "./frpcForm";
import postData from "@/mixin/postData";
export default {
    name: "serviceFrpc",
    mixins: [postData],
    components: { frpcForm },
    computed: {
        ...mapGetters(["$lang"])
    },
    props: {
        baseData: {
            type: Object
        }
    },
    data() {
        return {
            dialogVisible: false,
            type_maps: ["http", "https"]
        };
    },
    methods: {
        openDialog() {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["service-frpc-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(data => {
                if (data) {
                    const post_params = {
                        method: "set",
                        param: {
                            server_addr: data.server_addr,
                            server_port: data.server_port,
                            token: data.token,
                            appname: data.appname,
                            type: data.type,
                            remote_port: data.remote_port,
                            custom_domains: data.custom_domains,
                            subdomain: data.subdomain
                        }
                    };
                    this.postData("/system_service?form=frpc", post_params)
                        .then(_ => {
                            this.$emit("refresh");
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
.service-frpc-item {
    .base-font-style;
    padding: 6px;
}
h3 {
    color: @titleColor;
}
</style>