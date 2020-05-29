<template>
    <el-form :model="form" ref="qos-form" label-width="120px">
        <template v-if="type === 'queue'">
            <el-form-item :label="$lang('mode')" label-width="85px">
                <el-select v-model.number="form.flag">
                    <el-option label="Strict-priority" :value="1"></el-option>
                    <el-option label="WRR" :value="2"></el-option>
                </el-select>
            </el-form-item>
        </template>
        <template v-if="(type === 'cosq') || (type === 'queue' && form.flag === 2)">
            <el-row :gutter="10">
                <el-col :span="4">
                    <div class="qos-form-item">
                        <template v-if="type === 'cosq'">{{ $lang('queue') }}:</template>
                        <template v-if="type === 'queue'">{{ $lang('cos') }}</template>
                    </div>
                    <div class="qos-form-item">
                        <template v-if="type === 'cosq'">{{ $lang('priority') }}:</template>
                        <template v-if="type === 'queue'">{{ $lang('weight') }}:</template>
                    </div>
                </el-col>
                <el-col :span="2" style="width: 58px;">
                    <div class="qos-form-item">0</div>
                    <div class="qos-form-item">
                        <template v-if="type === 'cosq'">
                            <el-input v-validator="form.prio0" v-model.number="form.prio0"></el-input>
                        </template>
                        <template v-if="type === 'queue'">
                            <el-input v-model.number="form.wrr0"></el-input>
                        </template>
                    </div>
                </el-col>
                <template v-if="type === 'cosq'">
                    <template v-for="i in 7">
                        <el-col :span="2" style="width: 58px;">
                            <div class="qos-form-item">{{ i }}</div>
                            <div class="qos-form-item">
                                <el-input
                                    v-validator="form['prio' + i]"
                                    v-model.number="form['prio' + i]"
                                ></el-input>
                            </div>
                        </el-col>
                    </template>
                </template>
                <template v-if="type === 'queue'">
                    <template v-for="i in 7">
                        <el-col :span="2" style="width: 58px;">
                            <div class="qos-form-item">{{ i }}</div>
                            <div class="qos-form-item">
                                <el-input v-model.number="form['wrr' + i]"></el-input>
                            </div>
                        </el-col>
                    </template>
                </template>
            </el-row>
        </template>
    </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { regRange } from "@/utils/validator";
import { isFunction } from "@/utils/common";
export default {
    name: "qosForm",
    computed: {
        ...mapGetters(["$lang"])
    },
    data() {
        return {
            form: {
                prio0: "",
                prio1: "",
                prio2: "",
                prio3: "",
                prio4: "",
                prio5: "",
                prio6: "",
                prio7: "",
                flag: 1,
                wrr0: "",
                wrr1: "",
                wrr2: "",
                wrr3: "",
                wrr4: "",
                wrr5: "",
                wrr6: "",
                wrr7: ""
            },
            type: ""
        };
    },
    methods: {
        init(type, data) {
            this.$refs["qos-form"].resetFields();
            this.type = type;
            if (type === "cosq") {
                data.forEach((item, index) => {
                    this.form["prio" + index] = item || 0;
                });
            }
            if (type === "queue") {
                data.forEach((item, index) => {
                    this.form["wrr" + index] = item.weight || 0;
                });
            }
        },
        validate(fn) {
            if (this.type === "cosq") {
                for (let i = 0; i < 8; i++) {
                    if (!regRange(this.form["prio" + i], 0, 7)) {
                        return this.$message.error(this.$lang("param_error"));
                    }
                }
            }
            if (this.type === "queue") {
                for (let i = 0; i < 8; i++) {
                    if (!regRange(this.form["wrr" + i], 0, 100)) {
                        return this.$message.error(this.$lang("param_error"));
                    }
                }
            }
            if (isFunction(fn)) {
                fn.call(this, this.type, this.form);
            }
        }
    },
    directives: {
        validator: {
            update(el, { value }) {
                if (!regRange(value, 0, 7)) {
                    el.className += " input-validate-error";
                } else {
                    el.className = "el-input el-input--small";
                }
            }
        }
    }
};
</script>

<style lang="less" scoped>
.qos-form-item {
    margin: 12px 0;
    text-align: center;
    & + .qos-form-item {
        line-height: 32px;
    }
    .el-input /deep/ .el-input__inner {
        text-align: center;
    }
}
.input-validate-error /deep/ .el-input__inner {
    border-color: red;
}
</style>