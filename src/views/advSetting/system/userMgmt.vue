<template>
    <div>
        <page-header :title="$lang('user_mgmt')" type="none"></page-header>
        <div class="user-mgmt-table">
            <span>{{ $lang("current_user_list") }}</span>
            <el-button
                size="small"
                type="primary"
                style="margin-left: 30px"
                @click="openDialog('add')"
            >
                {{ $lang("add", "user") }}
            </el-button>
            <el-button
                size="small"
                type="primary"
                style="margin-left: 30px"
                @click="openDialog('delete')"
            >
                {{ $lang("delete", "user") }}
            </el-button>
            <el-button
                size="small"
                type="primary"
                style="margin-left: 30px"
                @click="openDialog('modify')"
            >
                {{ modifyBtnText }}
            </el-button>
        </div>
        <el-table
            border
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            :data="userList"
        >
            <el-table-column
                :label="$lang('user')"
                prop="name"
                width="250px"
            ></el-table-column>
            <el-table-column
                :label="$lang('status')"
                prop="status"
                width="80px"
            >
                <template slot-scope="scope">
                    {{ scope.row.status ? $lang("online") : $lang("offline") }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$lang('user_level')"
                prop="level"
                width="120px"
            >
                <template slot-scope="scope">
                    {{ USER_LEVEL[scope.row.level] }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$lang('user_reenter')"
                prop="reenter"
                width="150px"
            ></el-table-column>
            <el-table-column
                :label="$lang('logins')"
                prop="logins"
                width="150px"
            ></el-table-column>
            <el-table-column
                :label="$lang('desc')"
                prop="info"
            ></el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            :before-close="closeDialog"
        >
            <template slot="title">{{ $lang(dialogType) }}</template>
            <user-mgmt-form
                :type="dialogType"
                :data="userList"
                ref="user-mgmt-form"
            ></user-mgmt-form>
            <span slot="footer">
                <el-button @click="closeDialog">
                    {{ $lang("cancel") }}
                </el-button>
                <el-button type="primary" @click="submitForm('user-mgmt-form')">
                    {{ $lang("apply") }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
    isDef,
    isArray,
    isFunction,
    clearSessionStorage,
} from "@/utils/common";
import { USER_LEVEL } from "@/utils/commonData";
import userMgmtForm from "./userMgmt/form";
import md5 from "md5";
import postData from "@/mixin/postData";
import logout from "@/mixin/logout";
export default {
    name: "userMgmt",
    components: { userMgmtForm },
    mixins: [postData, logout],
    computed: {
        ...mapGetters(["$lang"]),
        modifyBtnText() {
            if (this.currUserLevel > 2) {
                return this.$lang("modify_user_pwd");
            }
            return this.$lang("modify", "password");
        },
    },
    data() {
        return {
            USER_LEVEL,
            userList: [],
            dialogVisible: false,
            dialogType: "",
            currUserLevel: 5,
            currUserName: "",
        };
    },
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(() => {
            this.updateAdvMainScrollbar();
        });
    },
    created() {
        this.getData();
        this.getUserLevel();
    },
    methods: {
        getData() {
            this.userList = [];
            this.$http
                .get("/usermgmt?form=userlist")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data) && isArray(res.data.data)) {
                            this.userList = res.data.data;
                        }
                    }
                })
                .catch((err) => {});
        },
        getUserLevel() {
            this.currUserName = "";
            this.currUserLevel = 5;
            this.$http
                .get("/usermgmt?form=userlevel")
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.currUserLevel = res.data.data.level;
                            this.currUserName = res.data.data.name;
                        }
                    }
                })
                .catch((err) => {});
        },
        openDialog(type) {
            this.dialogVisible = true;
            this.dialogType = type;
            this.$nextTick(() => {
                this.$refs["user-mgmt-form"].init(
                    this.currUserLevel,
                    this.currUserName
                );
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((data) => {
                if (data) {
                    this.submitAction(data, this.dialogType);
                }
            });
        },
        closeDialog(fn) {
            this.$refs["user-mgmt-form"].resetForm();
            this.$nextTick(() => {
                this.dialogType = "";
                if (isFunction(fn)) {
                    fn();
                } else {
                    this.dialogVisible = false;
                }
            });
        },
        submitAction(data, type) {
            const ACTIONS = {
                add(data) {
                    const url = "/usermgmt?form=userlist";
                    const post_param = {
                        method: "add",
                        param: {
                            name: data.user,
                            key: md5(`${data.user}:${data.user_pwd1}`),
                            level: data.user_level,
                            reenter: data.user_reenter,
                            info: data.desc,
                        },
                    };
                    return { url, post_param };
                },
                delete(data) {
                    const url = "/usermgmt?form=userlist";
                    const post_param = {
                        method: "delete",
                        param: {
                            name: data.user,
                        },
                    };
                    return { url, post_param };
                },
                modify(data) {
                    const url = "/usermgmt?form=modifyps",
                        flag =
                            this.currUserLevel > 2 ||
                            (this.currUserLevel <= 2 &&
                                this.currUserName === data.user),
                        post_param = {
                            method: "set",
                            param: {
                                name: data.user,
                                key: flag
                                    ? md5(`${data.user}:${data.current_pwd}`)
                                    : "",
                                key1: md5(`${data.user}:${data.user_pwd1}`),
                            },
                        };
                    return { url, post_param };
                },
            };
            if (isFunction(ACTIONS[type])) {
                const res = ACTIONS[type].call(this, data);
                if (res) {
                    const { post_param, url } = res;
                    const flag =
                        type === "modify" && this.currUserName === data.user;
                    this.postData(url, post_param, !flag)
                        .then((res) => {
                            if (flag) {
                                return this.logoutAction();
                            }
                            this.getData();
                            this.closeDialog();
                        })
                        .catch((err) => {});
                }
            }
        },
    },
};
</script>

<style lang="less" scoped>
.user-mgmt-table {
    margin: 20px 0 20px 10px;
    > span {
        color: @titleColor;
    }
}
</style>