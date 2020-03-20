<template>
    <div style="margin: 20px;">
        <page-header @port-change="portChange" type="pon">
            <div slot="title">{{ $lang('onu_allow') }}</div>
        </page-header>
        <el-table
            :data="showTable"
            border
            stripe
            @expand-change="updateScrollbar"
            @row-click="rowClick"
            ref="ont-info-table"
        >
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-row style="margin: 12px 0;">
                        <el-col :span="8">
                            <span class="collspace-title">sn:</span>
                            <span>{{ props.row.sn }}</span>
                        </el-col>
                        <el-col :span="8">
                            <span class="collspace-title">loid:</span>
                            <span>{{ props.row.loid }}</span>
                        </el-col>
                        <el-col :span="8">
                            <span class="collspace-title">loidpasswd:</span>
                            <span>{{ props.row.loidpasswd }}</span>
                        </el-col>
                    </el-row>
                    <el-row style="margin: 12px 0;">
                        <el-col :span="8">
                            <span class="collspace-title">ont_description:</span>
                            <span>{{ props.row.ont_description }}</span>
                        </el-col>
                        <el-col :span="8">
                            <span class="collspace-title">last_d_cause:</span>
                            <span>{{ props.row.last_d_cause }}</span>
                        </el-col>
                        <el-col :span="8">
                            <span class="collspace-title">last_dg_time:</span>
                            <span>{{ props.row.last_dg_time }}</span>
                        </el-col>
                    </el-row>
                    <el-row style="margin: 12px 0;">
                        <el-col :span="8">
                            <span class="collspace-title">uptime:</span>
                            <span>{{ props.row.uptime }}</span>
                        </el-col>
                        <el-col :span="8">
                            <span class="collspace-title">lineprof_id:</span>
                            <span>{{ props.row.lineprof_id }}</span>
                        </el-col>
                        <el-col :span="8">
                            <span class="collspace-title">lineprof_name:</span>
                            <span>{{ props.row.lineprof_name }}</span>
                        </el-col>
                    </el-row>
                    <el-row style="margin: 12px 0;">
                        <el-col :span="8">
                            <span class="collspace-title">srvprof_id:</span>
                            <span>{{ props.row.srvprof_id }}</span>
                        </el-col>
                        <el-col :span="8">
                            <span class="collspace-title">srvprof_name:</span>
                            <span>{{ props.row.srvprof_name }}</span>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column label="ont_id">
                <template
                    slot-scope="scope"
                >{{ `${getPortName((scope.row.identifier >> 8) & 0xff)}/${(scope.row.identifier) & 0xff}` }}</template>
            </el-table-column>
            <el-table-column label="ont_name" prop="ont_name"></el-table-column>
            <el-table-column label="state" prop="state"></el-table-column>
            <el-table-column label="rstate" prop="rstate"></el-table-column>
            <el-table-column label="cstate" prop="cstate"></el-table-column>
            <el-table-column label="mstate" prop="mstate"></el-table-column>
            <el-table-column label="authmode" prop="authmode"></el-table-column>
            <el-table-column label="last_u_time" prop="last_u_time"></el-table-column>
            <el-table-column label="last_d_time" prop="last_d_time"></el-table-column>
            <el-table-column :label="$lang('config')" width="100" prop="config">
                <template slot-scope="scope">
                    <el-button type="text" @click="openDialog(scope.row)">{{ $lang('config') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right; margin: 12px 0;"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="ontList.length"
            hide-on-single-page
        ></el-pagination>
        <el-dialog :title="$lang('config')" :visible.sync="dialogVisible" width="500px">
            <onu-allow-form ref="onu-allow-form"></onu-allow-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('onu-allow-form')">{{ $lang('apply') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isFunction, isArray } from "@/utils/common";
import onuAllowForm from "./onuAllow/onuAllowForm";
import postData from "@/mixin/postData";
export default {
    name: "onuAllow",
    components: { onuAllowForm },
    mixins: [postData],
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        showTable() {
            this.ontList = this.allOntList.filter(
                item => ((item.identifier >> 8) & 0xff) === this.port_id
            );
            const start = (this.currentPage - 1) * this.pageSize;
            return this.ontList.slice(start, start + this.pageSize);
        }
    },
    data() {
        return {
            port_id: 0,
            allOntList: [],
            ontList: [],
            currentPage: 1,
            pageSize: 10,
            dialogVisible: false
        };
    },
    created() {
        this.getData();
    },
    inject: ["updateNavScrollbar"],
    updated() {
        this.updateScrollbar();
    },
    methods: {
        portChange(port_id) {
            this.port_id = port_id;
        },
        getData() {
            this.allOntList = [];
            this.currentPage = 1;
            this.$http
                .get("/gponont_mgmt?form=base")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.allOntList = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        updateScrollbar() {
            this.$nextTick(_ => {
                this.updateNavScrollbar();
            });
        },
        rowClick(row, col, e) {
            col.property !== "config" &&
                this.$refs["ont-info-table"].toggleRowExpansion(row);
        },
        openDialog(row) {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["onu-allow-form"].init(row);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(formData => {
                if (formData) {
                    const url = "/gponont_mgmt?form=info",
                        data = {
                            method: "set",
                            param: {
                                identifier: formData.identifier,
                                ont_name: formData.ont_name,
                                ont_description: formData.ont_description
                            }
                        };
                    this.postData(url, data)
                        .then(_ => {
                            this.getData();
                        })
                        .catch(_ => {});
                    this.dialogVisible = false;
                }
            });
        }
    },
    watch: {}
};
</script>

<style lang="less" scoped>
.collspace-title {
    margin: 0 12px 0 0;
    display: inline-block;
    vertical-align: middle;
    max-width: 25%;
    & + span {
        display: inline-block;
        vertical-align: middle;
        max-width: 75%;
        word-wrap: break-word;
        word-break: break-all;
        color: @titleColor;
    }
}
</style>