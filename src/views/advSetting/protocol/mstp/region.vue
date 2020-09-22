<template>
    <div>
        <template v-if="Object.keys(regionInfo).length">
            <div class="mstp-region-item">
                <span>{{ $lang('format_selector') }}:</span>
                <span>{{ regionInfo.format_selector }}</span>
            </div>
            <div class="mstp-region-item">
                <span>{{ $lang('regional_name') }}:</span>
                <span>{{ regionInfo.regional_name }}</span>
                <el-button
                    type="primary"
                    size="small"
                    @click="setRegionalName"
                >{{ $lang('config') }}</el-button>
                <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px;"
                    @click="resetRegionalName"
                >{{ $lang('reset') }}</el-button>
            </div>
            <div class="mstp-region-item">
                <span>{{ $lang('revision_level') }}:</span>
                <span>{{ regionInfo.revision_level }}</span>
                <el-button
                    type="primary"
                    size="small"
                    @click="setRevisionLevel"
                >{{ $lang('config') }}</el-button>
            </div>
            <div class="mstp-region-item">
                <span>{{ $lang('conf_digest') }}:</span>
                <span>0x{{ regionInfo.conf_digest }}</span>
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDef } from "@/utils/common";
import postData from "@/mixin/postData";
import { regLength, regRange } from "@/utils/validator";
export default {
    name: "mstpRegion",
    computed: {
        ...mapGetters(["$lang", "validateMsg"])
    },
    data() {
        return {
            regionInfo: {},
            regional_name: "",
            revision_level: ""
        };
    },
    mixins: [postData],
    created() {
        this.getRegion();
    },
    inject: ["updateAdvMainScrollbar"],
    mounted() {
        this.$nextTick(_ => {
            this.updateAdvMainScrollbar();
        });
    },
    methods: {
        getRegion() {
            this.regionInfo = {};
            this.$http
                .get("/switch_mstp?form=mst_regional_get")
                .then(res => {
                    if (res.data.code === 1) {
                        if (isDef(res.data.data)) {
                            this.regionInfo = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        },
        resetRegionalName() {
            this.$confirm(
                this.$lang("if_sure", "reset", "regional_name") + " ?"
            )
                .then(_ => {
                    this.postData("/switch_mstp?form=regional_name_set", {
                        method: "set",
                        param: {
                            regional_name: ""
                        }
                    })
                        .then(_ => {
                            this.getRegion();
                        })
                        .catch(_ => {});
                })
                .catch(_ => {});
        },
        setRegionalName() {
            this.$prompt(this.$lang("regional_name"), this.$lang("config"), {
                inputValue: this.regionInfo.regional_name,
                confirmButtonText: this.$lang("apply"),
                cancelButtonText: this.$lang("cancel"),
                inputType: "textarea",
                inputValidator: val => regLength(val, 1, 32),
                inputErrorMessage: this.validateMsg("inputLength", 1, 32)
            })
                .then(({ value }) => {
                    if (value === this.regionInfo.regional_name) {
                        return this.$message.info(this.$lang("modify_tips"));
                    }
                    this.postData("/switch_mstp?form=regional_name_set", {
                        method: "set",
                        param: {
                            regional_name: value
                        }
                    })
                        .then(_ => {
                            this.getRegion();
                        })
                        .catch(_ => {});
                })
                .catch(() => {});
        },
        setRevisionLevel() {
            this.$prompt(this.$lang("revision_level"), this.$lang("config"), {
                inputValue: this.regionInfo.revision_level,
                confirmButtonText: this.$lang("apply"),
                cancelButtonText: this.$lang("cancel"),
                inputValidator: val => regRange(val, 0, 65535),
                inputErrorMessage: this.validateMsg("inputRange", 0, 65535)
            })
                .then(({ value }) => {
                    const val = Number(value);
                    if (val === this.regionInfo.revision_level) {
                        return this.$message.info(this.$lang("modify_tips"));
                    }
                    this.postData("/switch_mstp?form=revision_level_set", {
                        method: "set",
                        param: {
                            revision_level: val
                        }
                    })
                        .then(_ => {
                            this.getRegion();
                        })
                        .catch(_ => {});
                })
                .catch(() => {});
        }
    }
};
</script>

<style lang="less" scoped>
.mstp-region-item {
    .base-font-style;
    margin: 20px 0;
    > span {
        display: inline-block;
        vertical-align: middle;
    }
    > span + span {
        margin: 0 30px 0 20px;
    }
}
</style>