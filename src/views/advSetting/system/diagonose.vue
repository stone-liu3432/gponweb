<template>
    <div>
        <page-header type="none" :title="$lang('diagonose')"></page-header>
        <el-form
            label-width="180px"
            label-position="left"
            style="width: 480px;"
            :model="diag"
            :rules="rules"
            ref="diagonose-form"
        >
            <el-form-item :label="$lang('diag_tools_type')">
                <span>{{ $lang('diag_type') }}</span>
            </el-form-item>
            <el-form-item :label="$lang('dest_ping_ip')" prop="dest_ip">
                <el-input v-model="diag.dest_ip"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('diag_ping_intf')">
                <el-select v-model="diag.diag_intf">
                    <template v-for="item in interfaces">
                        <el-option
                            :value="item.ipaddr"
                            :label="$lang(item.interface) || item.interface"
                        ></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item :label="$lang('diag_ping_count')" prop="diag_count">
                <el-input v-model="diag.diag_count"></el-input>
            </el-form-item>
            <el-form-item :label="$lang('diag_ping_pktsize')" prop="diag_pktsize">
                <el-input v-model="diag.diag_pktsize"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    style="width: 200px;"
                    @click="startPing('diagonose-form')"
                    :loading="loading"
                >{{ $lang('start') }}</el-button>
            </el-form-item>
        </el-form>
        <el-input type="textarea" v-model="result" disabled resize="none" :rows="18"></el-input>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { regIp } from "@/utils/validator";
export default {
    name: "diagonose",
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        ...mapState(["interfaces"])
    },
    data() {
        return {
            result: "The device is ready!",
            loading: false,
            diag: {
                dest_ip: "",
                diag_intf: "",
                diag_count: "",
                diag_pktsize: ""
            },
            rules: {
                dest_ip: [
                    { validator: this.validateIp, trigger: ["change", "blur"] }
                ],
                diag_count: [
                    {
                        validator: this.validateCount,
                        trigger: ["change", "blur"]
                    }
                ],
                diag_pktsize: [
                    {
                        validator: this.validatePktsize,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    created() {
        this.getInterfaces();
    },
    methods: {
        ...mapActions(["getInterfaces"]),
        validateIp(rule, value, cb) {
            if (!regIp(value)) {
                return cb(new Error(this.validateMsg("ipaddr")));
            }
            cb();
        },
        validateCount(rule, value, cb) {
            if (value < 1 || value > 50 || isNaN(value)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 50)));
            }
            cb();
        },
        validatePktsize(rule, value, cb) {
            if (value < 4 || value > 1472 || isNaN(value)) {
                return cb(new Error(this.validateMsg("inputRange", 4, 1472)));
            }
            cb();
        },
        startPing(formName) {
            if (!this.diag.diag_intf) {
                return this.$message.error(this.$lang("required", "interface"));
            }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    const post_params = {
                        method: "start",
                        param: {
                            ipaddr: this.diag.dest_ip,
                            interface: this.diag.diag_intf,
                            count: this.diag.diag_count,
                            pktsize: this.diag.diag_pktsize
                        }
                    };
                    this.$http
                        .post("/diagnose?form=ping", post_params)
                        .then(res => {
                            if (res.data.code === 1) {
                                this.getResult();
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                                this.loading = false;
                            }
                        })
                        .catch(err => {});
                }
            });
        },
        getResult() {
            this.$http
                .get("/diagnose?form=ping")
                .then(res => {
                    if (res.data.code === 1) {
                        this.result = res.data.data.result;
                        if (res.data.data.finish === 1) {
                            setTimeout(_ => {
                                this.getResult();
                            }, 1000);
                        } else {
                            this.result += "\r\nFinished";
                            this.loading = false;
                        }
                    } else {
                        this.$message.error(
                            `(${res.data.code}) ${res.data.message}`
                        );
                        this.result = "The device is ready!";
                        this.loading = false;
                    }
                })
                .catch(err => {});
        }
    },
    watch: {
        interfaces() {
            this.interfaces.forEach(item => {
                if (item.interface === "outbound") {
                    this.diag.diag_intf = item.ipaddr;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>