<template>
    <div>
        <h3>
            SSH-Key
            <el-button
                type="primary"
                style="margin-left: 30px;"
                @click="openDialog"
            >{{ $lang('add', 'key') }}</el-button>
        </h3>
        <template v-if="!!baseData.length">
            <template v-for="item in baseData">
                <el-row class="ssh-key-item" :key="item.keyname">
                    <el-col :span="4">
                        <p>{{ $lang('title') + ': ' + item.keyname }}</p>
                        <div>
                            <el-button type="primary" @click="deleteSsh(item)">{{ $lang('delete') }}</el-button>
                        </div>
                    </el-col>
                    <el-col :span="20" style="word-break: break-all;">{{ item.publickey }}</el-col>
                </el-row>
            </template>
        </template>
        <el-dialog :title="$lang('add', 'key')" :visible.sync="dialogVisible" append-to-body>
            <ssh-form ref="ssh-key-form"></ssh-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('ssh-key-form')">{{ $lang('apply') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import sshForm from "./sshForm";
import postData from "@/mixin/postData";
export default {
    name: "serviceSsh",
    mixins: [postData],
    components: { sshForm },
    computed: {
        ...mapGetters(["$lang"])
    },
    props: {
        baseData: {
            type: Array
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
                this.$refs["ssh-key-form"].init();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(data => {
                if (data) {
                    const post_params = {
                        method: "add",
                        param: {
                            keyname: data.keyname,
                            publickey: data.publickey
                        }
                    };
                    this.postData("/system_service?form=sshd", post_params)
                        .then(_ => {
                            this.$emit("refresh");
                        })
                        .catch(_ => {});
                    this.dialogVisible = false;
                }
            });
        },
        deleteSsh(data) {
            this.$confirm(this.$lang("if_sure", "delete"))
                .then(_ => {
                    var post_param = {
                        method: "delete",
                        param: {
                            keyname: data.keyname
                        }
                    };
                    this.postData("/system_service?form=sshd", post_param)
                        .then(_ => {
                            this.$emit("refresh");
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        }
    }
};
</script>

<style lang="less" scoped>
h3 {
    color: @titleColor;
}
.ssh-key-item {
    .base-font-style;
    margin: 20px 0;
    p,
    p + div {
        text-align: center;
    }
}
</style>