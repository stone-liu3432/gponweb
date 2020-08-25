<template>
    <div>
        <div class="inter-working-title">
            <span>{{ $lang('port_maps') }}</span>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="openDialog('set')"
            >{{ $lang('config') }}</el-button>
            <el-button
                type="primary"
                size="small"
                style="margin-left: 30px;"
                @click="resetPortMaps"
            >{{ $lang('reset') }}</el-button>
        </div>
        <el-table :data="data" border stripe>
            <el-table-column :label="$lang('ingress')" width="120px">
                <template slot-scope="scope">{{ getPortName(scope.row.port_id) }}</template>
            </el-table-column>
            <el-table-column :label="$lang('egress')">
                <template slot-scope="scope">{{ parsePortlist(scope.row.inter_working_portlist) }}</template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="650px">
            <div slot="title">{{ $lang('config') }}</div>
            <inter-working-form ref="inter-working-form"></inter-working-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('inter-working-form')"
                >{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { parseStringAsList } from "@/utils/common";
import postData from "@/mixin/postData";
import interWorkingForm from "./interWorkingForm";
export default {
    name: "interWorking",
    computed: {
        ...mapGetters(["$lang", "getPortName"])
    },
    components: { interWorkingForm },
    mixins: [postData],
    props: {
        data: {
            type: Array,
            default: _ => []
        }
    },
    data() {
        return {
            dialogVisible: false,
            dialogType: ""
        };
    },
    methods: {
        parsePortlist(str) {
            return parseStringAsList(str)
                .map(item => this.getPortName(item))
                .join(",");
        },
        openDialog(type) {
            this.dialogType = type;
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["inter-working-form"].init(this.data);
            });
        },
        resetPortMaps() {
            this.$confirm()
                .then(_ => {
                    this.postData(
                        "/switch_isolate?form=inter_working_default",
                        {
                            method: "set",
                            param: {}
                        }
                    )
                        .then(_ => {
                            this.$emit("refresh-data");
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        submitForm(formName) {
            this.$refs[formName].validate(form => {
                const list = form.portlist.join(",");
                const flag = this.data.some(
                    item =>
                        item.port_id === form.port_id &&
                        item.inter_working_portlist === list
                );
                if (flag) {
                    return this.$message.info(this.$lang("modify_tips"));
                }
                this.postData("/switch_isolate?form=inter_working", {
                    method: "set",
                    param: {
                        port_id: form.port_id,
                        inter_working_portlist: list
                    }
                })
                    .then(_ => {
                        this.$emit("refresh-data");
                    })
                    .catch(_ => {});
                this.dialogVisible = false;
            });
        }
    }
};
</script>

<style lang="less" scoped>
.inter-working-title {
    .base-font-style;
    margin: 20px 10px;
}
</style>