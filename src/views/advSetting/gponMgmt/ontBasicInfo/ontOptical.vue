<template>
    <div>
        <template v-for="key in KEY_MAP">
            <div class="ont-optical-item">
                <span>{{ $lang(key) }}:</span>
                <span>{{ (data[key] || '-') }}</span>
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "ontOptical",
    computed: {
        ...mapGetters(["$lang", "getPortName"]),
        KEY_MAP() {
            return [
                "work_temprature",
                "work_voltage",
                "transmit_bias",
                "transmit_power",
                "receive_power"
            ];
        }
    },
    props: {
        data: {
            type: Object
        }
    },
    data() {
        return {};
    },
    methods: {}
};
</script>

<style lang="less" scoped>
.ont-optical-item {
    .base-font-style;
    margin: 12px 0 12px 10px;
    > span {
        display: inline-block;
        vertical-align: middle;
        width: 140px;
    }
}
</style>