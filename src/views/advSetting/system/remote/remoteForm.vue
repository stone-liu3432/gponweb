<template>
    <el-form label-width="120px" :model="bound" :rules="rules" ref="remote-form">
        <el-form-item :label="$lang('interface')" v-if="showInterface">
            <span>{{ formData.interface }}</span>
        </el-form-item>
        <el-form-item :label="$lang('ipaddr')" prop="ipaddr">
            <el-input v-model="bound.ipaddr"></el-input>
        </el-form-item>
        <el-form-item :label="$lang('ipmask')" prop="ipmask">
            <el-input v-model="bound.ipmask"></el-input>
        </el-form-item>
        <el-form-item
            :label="$lang('vlan_id')"
            prop="vlan_id"
            v-show="!(formData && formData.interface === 'outbound')"
        >
            <el-input :disabled="type === 'config'" v-model.number="bound.vlan_id"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { regRange } from "@/utils/validator";
import { isFunction } from "@/utils/common";
export default {
    name: "remoteForm",
    props: {
        type: {
            type: String
        },
        formData: {
            type: Object
        }
    },
    computed: {
        ...mapGetters(["$lang", "validateMsg"]),
        showInterface() {
            return this.formData && this.type === "config";
        }
    },
    inject: ["validateIp"],
    data() {
        return {
            bound: {
                ipaddr: "",
                ipmask: "",
                vlan_id: "",
                interface: ""
            },
            rules: {
                ipaddr: [
                    {
                        validator: this.validateIp,
                        trigger: ["change", "blur"]
                    }
                ],
                ipmask: [
                    {
                        validator: this.validateIp,
                        trigger: ["change", "blur"]
                    }
                ],
                vlan_id: [
                    {
                        validator: this.validateVlan,
                        trigger: ["change", "blur"]
                    }
                ]
            }
        };
    },
    created() {
        if (this.formData) {
            for (let key in this.bound) {
                this.bound[key] = this.formData[key] || "";
            }
        }
    },
    methods: {
        validate(fn) {
            return new Promise((resolve, reject) => {
                this.$refs["remote-form"].validate(valid => {
                    if (isFunction(fn)) {
                        if (valid) {
                            return fn.call(this, this.bound);
                        } else {
                            return fn.call(this);
                        }
                    } else {
                        if (valid) {
                            resolve(this.bound);
                        } else {
                            reject();
                        }
                    }
                });
            });
        },
        resetForm() {
            this.$nextTick(_ => {
                this.$refs["remote-form"].resetFields();
            });
        },
        validateVlan(rule, value, cb) {
            if (this.type !== "add" && this.formData.interface === "outbound") {
                return cb();
            }
            if (!regRange(this.bound.vlan_id, 1, 4094)) {
                return cb(new Error(this.validateMsg("inputRange", 1, 4094)));
            }
            cb();
        }
    },
    watch: {
        formData() {
            if (this.formData) {
                for (let key in this.bound) {
                    this.bound[key] = this.formData[key] || "";
                }
            } else {
                this.resetForm();
            }
        }
    }
};
</script>

<style lang='less' scoped>
</style>