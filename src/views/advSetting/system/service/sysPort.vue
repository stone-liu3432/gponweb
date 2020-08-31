<template>
    <div>
        <h3>
            {{ $lang('sys_port') }}
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog"
            >{{ $lang('config') }}</el-button>
        </h3>
        <div class="system-port-item">
            <span>http:</span>
            <span>{{ baseData.http || '-' }}</span>
        </div>
        <div class="system-port-item">
            <span>https:</span>
            <span>{{ baseData.https || '-' }}</span>
        </div>
        <div class="system-port-item">
            <span>telnet:</span>
            <span>{{ baseData.telnet || '-' }}</span>
        </div>
        <el-dialog :visible="dialogVisible" append-to-body width="650px">
            <div slot="title">{{ $lang('config') }}</div>
            <sys-port-form ref="sys-port-form"></sys-port-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('sys-port-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import sysPortForm from "./sysPortForm";
import postData from "@/mixin/postData";
export default {
    name: "sysPort",
    mixins: [postData],
    components: { sysPortForm },
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
            dialogVisible: false
        };
    },
    methods: {
        openDialog() {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["sys-port-form"].init(this.baseData);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(form => {
                if (form) {
                    if (
                        form.http === this.baseData.http &&
                        form.https === this.baseData.https &&
                        form.telnet === this.baseData.telnet
                    ) {
                        return this.$message.info(this.$lang("modify_tips"));
                    }
                    this.postData("/system_service?form=port", {
                        method: "set",
                        param: {
                            http: form.http,
                            https: form.https,
                            telnet: form.telnet
                        }
                    })
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
.system-port-item {
    .base-font-style;
    margin: 20px 0 20px 10px;
    span {
        display: inline-block;
        vertical-align: middle;
        & + span {
            margin-left: 12px;
        }
    }
}
h3 {
    color: @titleColor;
}
</style>