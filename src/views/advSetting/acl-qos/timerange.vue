<template>
    <div>
        <page-header type="none" :title="$lang('timerange')">
            <div slot="content">
                <el-button type="primary" size="mini" @click="openDialog">{{ $lang('add') }}</el-button>
                <el-button
                    type="primary"
                    size="mini"
                    style="margin-left: 30px;"
                    v-if="timerangeList.length"
                    @click="deleteAllTimerange"
                >{{ $lang('delete_all') }}</el-button>
            </div>
        </page-header>
        <el-table :data="timerangeTable" border @expand-change="expandChange">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <div
                        class="timerange-expand-content"
                        v-if="isArray(scope.row.absolute) && scope.row.absolute.length"
                    >
                        <div>{{ $lang('absolute') }}:</div>
                        <div>
                            <template v-for="item in scope.row.absolute">
                                <el-row style="margin: 12px 0;">
                                    <el-col :span="8">
                                        <span>{{ $lang('stime') }}:</span>
                                        <span>{{ `${item.sday} ${item.stime}` }}</span>
                                    </el-col>
                                    <el-col :span="8">
                                        <span>{{ $lang('etime') }}:</span>
                                        <span>{{ `${item.eday} ${item.etime}` }}</span>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-button
                                            type="text"
                                            @click="deleteTimerange(scope.row, item)"
                                        >{{ $lang('delete') }}</el-button>
                                    </el-col>
                                </el-row>
                            </template>
                        </div>
                    </div>
                    <div
                        class="timerange-expand-content"
                        v-if="isArray(scope.row.relative) && scope.row.relative.length"
                    >
                        <div>{{ $lang('relative') }}:</div>
                        <div>
                            <template v-for="item in scope.row.relative">
                                <el-row style="margin: 12px 0;">
                                    <el-col :span="6">
                                        <span>{{ $lang('stime') }}:</span>
                                        <span>{{ item.stime }}</span>
                                    </el-col>
                                    <el-col :span="6">
                                        <span>{{ $lang('etime') }}:</span>
                                        <span>{{ item.etime }}</span>
                                    </el-col>
                                    <el-col :span="6">
                                        <span>{{ $lang('day') }}:</span>
                                        <span>{{ item.day }}</span>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button
                                            type="text"
                                            @click="deleteTimerange(scope.row, item)"
                                        >{{ $lang('delete') }}</el-button>
                                    </el-col>
                                </el-row>
                            </template>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column :label="$lang('name')" prop="name"></el-table-column>
            <el-table-column :label="$lang('state')" prop="state"></el-table-column>
        </el-table>
        <div class="timerange-pagination-container">
            <!-- 使用 float: right ，会影响 wrap 的 clientHeight 值，导致滚动条异常 -->
            <el-pagination
                style="margin: 12px 0 30px 0; position: absolute; right: 0; top: 12px;"
                hide-on-single-page
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="timerangeList.length"
            ></el-pagination>
        </div>
        <el-dialog :visible.sync="dialogVisible" append-to-body width="600px">
            <div slot="title">{{ $lang('add') }}</div>
            <timerange-form ref="timerange-form"></timerange-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false;">{{ $lang('cancel') }}</el-button>
                <el-button type="primary" @click="submitForm('timerange-form')">{{ $lang('apply') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { isArray, isFunction } from "@/utils/common";
import postData from "@/mixin/postData";
import timerangeForm from "./timerange/timerangeForm";
export default {
    name: "timerange",
    components: { timerangeForm },
    computed: {
        ...mapGetters(["$lang"]),
        ...mapState(["timerangeList"]),
        timerangeTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.timerangeList.slice(start, start + this.pageSize);
        }
    },
    mixins: [postData],
    inject: ["updateAdvMainScrollbar"],
    updated() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            dialogVisible: false
        };
    },
    created() {
        this.getTimerange();
    },
    methods: {
        ...mapActions(["getTimerange"]),
        isArray(item) {
            return isArray(item);
        },
        expandChange(row, expands) {
            this.$nextTick(_ => {
                this.updateAdvMainScrollbar();
            });
        },
        openDialog() {
            this.dialogVisible = true;
            this.$nextTick(_ => {
                this.$refs["timerange-form"].init();
            });
        },
        deleteAllTimerange() {
            this.$confirm(
                this.$lang("if_sure", "delete_all", "timerange") + " ?"
            )
                .then(_ => {
                    this.postData("/switch_acl?form=time_range", {
                        method: "delete",
                        param: {
                            name: "all",
                            time: "",
                            day: ""
                        }
                    })
                        .then(_ => {
                            this.getTimerange();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        deleteTimerange(row, item) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    let param;
                    if (item.day) {
                        param = {
                            name: row.name,
                            time: item.stime,
                            day: ""
                        };
                    } else {
                        param = {
                            name: row.name,
                            time: item.stime,
                            day: item.sday
                        };
                    }
                    this.postData("/switch_acl?form=time_range", {
                        method: "delete",
                        param
                    })
                        .then(_ => {
                            this.getTimerange();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        submitForm(formName) {
            this.$refs[formName].validate(form => {
                if (form) {
                    let url, param;
                    const [stime, etime] = form.timerange;
                    if (form.type === 0) {
                        url = "/switch_acl?form=time_range&type=relative";
                        param = {
                            name: form.name,
                            stime: `${stime.getHours()}:${stime.getMinutes()}`,
                            etime: `${etime.getHours()}:${etime.getMinutes()}`,
                            day: form.day
                        };
                    } else {
                        url = "/switch_acl?form=time_range&type=absolute";
                        param = {
                            name: form.name,
                            stime: `${stime.getHours()}:${stime.getMinutes()}`,
                            sday: `${stime.getFullYear()}/${stime.getMonth() +
                                1}/${stime.getDate()}`,
                            etime: `${etime.getHours()}:${etime.getMinutes()}`,
                            eday: `${etime.getFullYear()}/${etime.getMonth() +
                                1}/${etime.getDate()}`
                        };
                    }
                    this.postData(url, {
                        method: "create",
                        param
                    })
                        .then(_ => {
                            this.getTimerange();
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
.timerange-expand-content {
    margin: 12px 0;
    line-height: 32px;
    > div {
        float: left;
        & + div {
            width: 800px;
            span + span {
                margin: 0 12px;
            }
        }
        &:first-child {
            color: @titleColor;
            margin: 12px 20px;
        }
    }
    &:after {
        content: "";
        display: table;
        clear: both;
    }
}
.timerange-pagination-container {
    position: relative;
}
</style>