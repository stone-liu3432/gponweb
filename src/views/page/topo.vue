<template>
    <div>
        <canvas ref="topo" :width="width" :height="height"></canvas>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import "../../assets/jtopo-0.4.8-min";
import { isArray, throttle, debounce, removeItem } from "@/utils/common";
export default {
    name: "topo",
    computed: {
        ...mapGetters(["$lang"]),
        ...mapState(["pon"]),
        width() {
            return this.clientWidth < 1280 ? 1280 : this.clientWidth;
        },
    },
    inject: ["updateNavScrollbar"],
    updated() {
        this.$nextTick(() => {
            this.updateNavScrollbar();
        });
    },
    data() {
        return {
            ontList: [],
            clientWidth: 0,
            clientHeight: 0,
            height: 0,
            stage: null,
            scene: null,
            // 缓存节点信息，全局展示时为 null
            ponNode: null,
        };
    },
    created() {
        this.getPon();
    },
    mounted() {
        this.stage = new JTopo.Stage(this.$refs.topo);

        this.setRect();
        const fn = throttle(this.setRect, 300, this);
        window.addEventListener("resize", fn, true);
        this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("resize", fn);
        });
    },
    methods: {
        ...mapActions(["getPon"]),
        setRect() {
            const { width, height } = document.body.getBoundingClientRect();
            this.clientWidth = width;
            // 减掉 header 的高度，及水平滚动条的高度
            this.clientHeight = height - 71 - 6;
            this.height = this.clientHeight;
            this.$nextTick(() => {
                this.draw();
            });
        },
        getOntList(port_id) {
            this.ontList = [];
            return this.$http
                .get(`/gponont_mgmt?form=auth&port_id=${port_id}`)
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.ontList = res.data.data;
                            return Promise.resolve(res.data.data);
                        }
                    }
                    return Promise.reject(res);
                })
                .catch((err) => {});
        },
        draw() {
            this.initScene();
        },
        initScene() {
            if (this.scene) {
                this.scene.clear();
                this.scene = null;
            }
            this.scene = new JTopo.Scene(this.stage);
            this.scene.translate = false;
        },
    },
};
</script>

<style lang="less" scoped>
</style>