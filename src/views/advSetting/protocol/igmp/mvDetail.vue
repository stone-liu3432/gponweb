<template>
    <div>
        <div class="multicast-vlan-detail-item">
            <span>{{ $lang('mvlan') }}:</span>
            <span>{{ row.mvlan }}</span>
        </div>
        <div class="multicast-vlan-detail-item">
            <span>{{ $lang('mvlan_desc') }}:</span>
            <span>{{ row.mvlan_desc }}</span>
            <el-button
                type="primary"
                size="mini"
                style="margin-left: 30px;"
                @click="setData('desc', row)"
            >{{ $lang('config') }}</el-button>
        </div>
        <div class="multicast-vlan-detail-item">
            <span>{{ $lang('router_portlist') }}:</span>
            <span>{{ generateList(row.router_portlist) }}</span>
            <el-button
                type="primary"
                size="mini"
                style="margin-left: 30px;"
                @click="setData('add_router', row)"
            >{{ $lang('add') }}</el-button>
            <el-button
                type="primary"
                size="mini"
                style="margin-left: 30px;"
                @click="setData('del_router', row)"
            >{{ $lang('delete') }}</el-button>
        </div>
        <div class="multicast-vlan-detail-item">
            <span>{{ $lang('mc_unknown_policy') }}:</span>
            <span>{{ $lang(MULTICAST_UNKNOWN_POLICYS[mcUnknown.mc_unknown_policy]) || '' }}</span>
            <el-button
                type="primary"
                size="mini"
                style="margin-left: 30px;"
                @click="setData('policy', row, mcUnknown)"
            >{{ $lang('config') }}</el-button>
        </div>
        <div class="multicast-vlan-detail-item">
            <span>{{ $lang('program') }}:</span>
        </div>
        <el-table :data="programTable" border>
            <el-table-column :label="$lang('ipaddr')" prop="ipaddr">
                <template slot-scope="scope">{{ `${scope.row.program_s} - ${scope.row.program_e}` }}</template>
            </el-table-column>
            <el-table-column :label="$lang('program_desc')" prop="program_desc"></el-table-column>
            <el-table-column :label="$lang('config')" width="120px">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="setData('program', row, scope.row)"
                    >{{ $lang('config') }}</el-button>
                    <el-button type="text" @click="deleteProgram(scope.row)">{{ $lang('delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="multicast-vlan-detail-item">
            <el-pagination
                style="float: right; margin: 12px 0;"
                hide-on-single-page
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="programs.length"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { MULTICAST_UNKNOWN_POLICYS } from "@/utils/commonData";
import postData from "@/mixin/postData";
import { removeItem, parseStringAsList } from "@/utils/common";
export default {
    name: "mvDetail",
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        programTable() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.programs.slice(start, start + this.pageSize);
        }
    },
    mixins: [postData],
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            MULTICAST_UNKNOWN_POLICYS
        };
    },
    props: {
        row: {
            type: Object
        },
        mcUnknown: {
            type: Object
        },
        programs: {
            type: Array
        }
    },
    methods: {
        generateList(portlist) {
            return parseStringAsList(portlist)
                .map(item => this.getPortName(item))
                .join(",");
        },
        deleteProgram(data) {
            this.$confirm(this.$lang("if_sure", "delete") + " ?")
                .then(_ => {
                    const url = "/switch_igmp?form=program",
                        post_params = {
                            method: "delete",
                            param: {
                                mvlan: this.row.mvlan,
                                program_s: data.program_s,
                                program_e: data.program_e,
                                program_desc: data.program_desc
                            }
                        };
                    this.postData(url, post_params)
                        .then(_ => {
                            removeItem(this.programs, data);
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        /**
         * type: dialog type
         * row: mvlan -> row
         * data: program -> data
         */
        setData(type, row, data) {
            this.$emit("config-mvlan", type, row, data);
        }
    }
};
</script>

<style lang="less" scoped>
.multicast-vlan-detail-item {
    margin: 12px 0;
    &::after {
        content: "";
        display: table;
        clear: both;
    }
    > span {
        display: inline-block;
        vertical-align: middle;
    }
    span + span {
        margin-left: 12px;
        max-width: 480px;
        word-break: break-all;
        overflow-wrap: break-word;
    }
}
</style>