<template>
    <div class="topo">
        <canvas ref="topo" :width="width" :height="height"></canvas>
        <nms-popover
            :visible.sync="visible"
            :position="position"
            :placement="placement"
            :width="ctxMenuWidth"
            @command="commandHandle"
            ref="popover"
        >
            <template v-if="popoverType === 'popover'">
                <template v-if="devType === 'pon'">
                    <div class="device-info">
                        <div>
                            <span>{{ $lang("port_id") }}:</span>
                            <span>{{ getPortName(popoverData.port_id) }}</span>
                        </div>
                        <div>
                            <span>{{ $lang("status") }}:</span>
                            <span>{{
                                popoverData.status
                                    ? $lang("online")
                                    : $lang("offline")
                            }}</span>
                        </div>
                        <div>
                            <span>{{ $lang("online") }}:</span>
                            <span>{{ popoverData.online }}</span>
                        </div>
                        <div>
                            <span>{{ $lang("offline") }}:</span>
                            <span>{{ popoverData.offline }}</span>
                        </div>
                    </div>
                </template>
                <template v-if="devType === 'onu'">
                    <div class="device-info">
                        <div>
                            <span>{{ $lang("onu_id") }}:</span>
                            <span :title="onuName">
                                {{
                                    `${(popoverData.identifier >> 8) & 0xff}/${
                                        popoverData.identifier & 0xff
                                    }`
                                }}
                            </span>
                        </div>
                        <div>
                            <span>{{ $lang("name") }}:</span>
                            <span>{{ popoverData.ont_name }}</span>
                        </div>
                        <div>
                            <span>{{ $lang("sn") }}:</span>
                            <span>{{ popoverData.ont_sn }}</span>
                        </div>
                        <div>
                            <span>{{ $lang("state") }}:</span>
                            <span>{{ ONT_STATES[popoverData.state] }}</span>
                        </div>
                        <div>
                            <span>{{ $lang("rstate") }}:</span>
                            <span>{{ ONT_RSTATES[popoverData.rstate] }}</span>
                        </div>
                        <div>
                            <span>{{ $lang("cstate") }}:</span>
                            <span>
                                {{ ONT_CSTATES[popoverData.cstate] }}
                            </span>
                        </div>
                        <div>
                            <span>{{ $lang("mstate") }}:</span>
                            <span>
                                {{ ONT_MSTATES[popoverData.mstate] }}
                            </span>
                        </div>
                    </div>
                </template>
                <template v-if="devType === 'splitter'">
                    <div class="device-info">
                        <div>
                            <span>{{ $lang("port_id") }}:</span>
                            <span>{{ getPortName(popoverData.port_id) }}</span>
                        </div>
                        <div>
                            <span>{{ $lang("splitter_id") }}:</span>
                            <span>{{ popoverData.splitter_id }}</span>
                        </div>
                        <div>
                            <span>{{ $lang("name") }}:</span>
                            <span>{{ popoverData.name }}</span>
                        </div>
                        <div>
                            <span>{{ $lang("desc") }}:</span>
                            <span>{{ popoverData.description }}</span>
                        </div>
                    </div>
                </template>
            </template>
            <template v-if="popoverType === 'contextmenu'">
                <template v-if="devType === 'pon'">
                    <!-- <nms-dropdown-item
                        style="cursor: pointer"
                        :command="composeData('pon', 'sla_cfg')"
                    >
                        {{ $lang("sla_cfg") }}
                    </nms-dropdown-item> -->
                    <nms-dropdown-item
                        style="cursor: pointer"
                        :command="composeData('pon', 'pon_setting')"
                    >
                        {{ $lang("pon_setting") }}
                    </nms-dropdown-item>
                    <nms-dropdown-item
                        style="cursor: pointer"
                        :command="composeData('pon', 'pon_optical')"
                    >
                        {{ $lang("pon_optical") }}
                    </nms-dropdown-item>
                    <!-- <nms-dropdown-item
                        style="cursor: pointer"
                        :command="composeData('pon', 'batch_config')"
                    >
                        {{ $lang("batch_config") }}
                    </nms-dropdown-item> -->
                </template>
                <template v-if="devType === 'onu'">
                    <nms-dropdown-item
                        style="cursor: pointer"
                        :command="composeData('onu', 'detail')"
                    >
                        {{ $lang("detail") }}
                    </nms-dropdown-item>
                    <nms-dropdown-item
                        style="cursor: pointer"
                        :command="composeData('onu', 'onu_port_cfg')"
                    >
                        {{ $lang("onu_port_cfg") }}
                    </nms-dropdown-item>
                    <nms-dropdown-item
                        style="cursor: pointer"
                        :command="composeData('onu', 'del_onu')"
                    >
                        {{ $lang("del_onu") }}
                    </nms-dropdown-item>
                    <nms-dropdown-item
                        style="cursor: pointer"
                        :command="composeData('onu', 'add_to_deny')"
                    >
                        {{ $lang("add_to_deny") }}
                    </nms-dropdown-item>
                    <nms-dropdown-item
                        style="cursor: pointer"
                        :command="composeData('onu', 'reboot_onu')"
                    >
                        {{ $lang("reboot_onu") }}
                    </nms-dropdown-item>
                </template>
                <template v-if="devType === 'splitter'">
                    <nms-dropdown-item
                        style="cursor: pointer"
                        :command="composeData('splitter', 'bindOnu')"
                    >
                        {{ $lang("bind_onu") }}
                    </nms-dropdown-item>
                    <nms-dropdown-item
                        style="cursor: pointer"
                        :command="composeData('splitter', 'config')"
                    >
                        {{ $lang("config") }}
                    </nms-dropdown-item>
                    <template v-if="popoverData.hasNextlayer">
                        <nms-dropdown-item
                            style="cursor: pointer"
                            :command="composeData('splitter', 'addNextlayer')"
                        >
                            {{ $lang("add_sub_splitter") }}
                        </nms-dropdown-item>
                    </template>
                    <template
                        v-if="!popoverData.children && popoverData.parent !== 0"
                    >
                        <nms-dropdown-item
                            style="cursor: pointer"
                            :command="composeData('splitter', 'delSplitter')"
                        >
                            {{ $lang("delete") }}
                        </nms-dropdown-item>
                    </template>
                </template>
            </template>
        </nms-popover>
        <div class="topo-toolbar">
            <span @click="refreshImage">{{ $lang("refreshOrReset") }}</span>
            <span @click="saveAsImage">{{ $lang("saveAsImage") }}</span>
            <input type="text" placeholder="mac / name" v-model="findStr" />
            <span style="width: 80px">
                <template v-if="!find">{{ $lang("no_result") }}</template>
                <template v-else>
                    <span>{{ index + 1 }}</span>
                    /
                    <span>{{ nodes.length }}</span>
                </template>
            </span>
            <span style="padding: 6px 0" @click="changeNode('next')">
                <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    :fill="find ? '#000' : '#aaa'"
                >
                    <path
                        d="M512 849.691045c-8.142447 0-15.950274-3.234671-21.707394-8.991792l-255.82655-255.82655c-11.988032-11.989055-11.988032-31.425733 0-43.414789 11.989055-11.990079 31.426757-11.990079 43.415812 0l234.118132 234.118132 234.119155-234.118132c11.988032-11.990079 31.426757-11.990079 43.414789 0 11.989055 11.989055 11.989055 31.425733 0 43.414789l-255.82655 255.82655C527.950274 846.456375 520.141424 849.691045 512 849.691045z"
                    />
                    <path
                        d="M512 849.691045c-16.954137 0-30.699186-13.745049-30.699186-30.699186l0-613.983719c0-16.954137 13.745049-30.699186 30.699186-30.699186s30.699186 13.745049 30.699186 30.699186l0 613.983719C542.699186 835.945997 528.954137 849.691045 512 849.691045z"
                    />
                </svg>
            </span>
            <span style="padding: 6px 0" @click="changeNode('prev')">
                <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    :fill="find ? '#000' : '#aaa'"
                >
                    <path
                        d="M512 174.30895499c8.142447 0 15.950274 3.234671 21.707394 8.99179201l255.82655 255.82655c11.988032 11.989055 11.988032 31.425733 0 43.414789-11.989055 11.990079-31.426757 11.990079-43.415812 1e-8l-234.118132-234.118132-234.11915501 234.11813199c-11.988032 11.990079-31.426757 11.990079-43.41478899 0-11.989055-11.989055-11.989055-31.425733 0-43.414789l255.82655-255.82655C496.049726 177.543625 503.85857601 174.308955 512 174.30895499z"
                    />
                    <path
                        d="M512 174.30895499c16.954137 0 30.699186 13.745049 30.699186 30.69918601l0 613.983719c0 16.954137-13.745049 30.699186-30.699186 30.699186s-30.699186-13.745049-30.699186-30.699186l0-613.983719C481.300814 188.054003 495.045863 174.308955 512 174.30895499z"
                    />
                </svg>
            </span>
            <span @click="findNode">{{ $lang("find") }}</span>
        </div>
        <el-dialog :visible.sync="dialogVisible" width="600px">
            <div slot="title">
                {{
                    dialogType === "bind"
                        ? $lang("bind_onu")
                        : dialogType === "add"
                        ? $lang("add_sub_splitter")
                        : $lang("config")
                }}
            </div>
            <el-form :model="formData" :rules="rules" label-width="120px">
                <template
                    v-if="dialogType === 'add' || dialogType === 'config'"
                >
                    <template v-if="dialogType === 'add'">
                        <el-form-item :label="$lang('port_id')" prop="port_id">
                            {{ getPortName(popoverData.port_id) }}
                        </el-form-item>
                        <el-form-item
                            :label="$lang('splitter_parent') + ' ID'"
                            prop="splitter_id"
                        >
                            <span>{{ popoverData.splitter_id }}</span>
                        </el-form-item>
                    </template>
                    <template v-if="dialogType === 'config'">
                        <el-form-item
                            :label="$lang('splitter_id')"
                            prop="splitter_id"
                        >
                            {{ popoverData.splitter_id }}
                        </el-form-item>
                    </template>
                    <el-form-item :label="$lang('name')" prop="name">
                        <el-input v-model="formData.name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$lang('desc')" prop="description">
                        <el-input
                            type="textarea"
                            v-model="formData.description"
                        ></el-input>
                    </el-form-item>
                </template>
                <template v-if="dialogType === 'bind'">
                    <el-form-item :label="$lang('port_id')" prop="port_id">
                        {{ getPortName(popoverData.port_id) }}
                    </el-form-item>
                    <el-form-item
                        :label="$lang('splitter_id')"
                        prop="splitter_id"
                    >
                        {{ popoverData.name }}
                    </el-form-item>
                    <el-form-item :label="$lang('onulist')" prop="onulist">
                        <el-checkbox-group v-model="formData.onulist">
                            <template v-for="item in onulist">
                                <el-checkbox :label="item.identifier & 0xff">
                                    {{ item.ont_name }}
                                </el-checkbox>
                            </template>
                        </el-checkbox-group>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false">
                    {{ $lang("cancel") }}
                </el-button>
                <el-button @click="submitForm" type="primary">
                    {{ $lang("apply") }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { throttle, debounce, removeItem, isDef, isArray } from "@/utils/common";
import { mapActions, mapGetters, mapState } from "vuex";
import { regLength } from "@/utils/validator";
import {
    ONT_STATES,
    ONT_RSTATES,
    ONT_MSTATES,
    ONT_CSTATES,
} from "@/utils/commonData";
import "@/assets/jtopo-0.4.8-min";
import splitterImg from "@/assets/spliter.png";
export default {
    name: "topo",
    data() {
        return {
            ONT_STATES,
            ONT_RSTATES,
            ONT_MSTATES,
            ONT_CSTATES,
            clientWidth: 0,
            clientHeight: 0,
            stage: null,
            scene: null,
            // 点击pon口时保存触发点击的pon节点
            ponNode: null,
            // 换行递增的高度
            baseStep: 100,

            ponList: [],
            splitterList: [],
            height: 0,
            // "all", "pon" -> canvas内显示的列表类型
            pageType: "all",
            visible: false,
            // "popover", "contextmenu"  -> popover类型
            popoverType: "popover",
            position: { x: 0, y: 0 },
            // "pon", "onu", "splitter"  -> popover要显示的设备类型
            devType: "",
            placement: "",
            popoverData: {},
            findStr: "",
            findFlag: false,
            // 搜索结果
            nodes: [],
            index: 0,
            //
            dialogVisible: false,
            dialogType: "",
            formData: {
                // splitter_id: "",
                name: "",
                description: "",
                onulist: [],
            },
            // 点击单个onu时，显示onu与splitter间的连接线时
            showOnuLine: false,
            rules: {
                name: [
                    { validator: this.validName, trigger: ["change", "blur"] },
                ],
                description: [
                    { validator: this.validDesc, trigger: ["change", "blur"] },
                ],
            },
        };
    },
    computed: {
        ...mapGetters(["$lang", "getPortName", "validateMsg"]),
        ...mapState(["pon", "onulist"]),
        width() {
            // 去除右侧滚动条宽度
            //  页面最小宽度，去除滚动条宽度 1280 - 17
            let width = this.clientWidth - 17;
            return width < 1263 ? 1263 : width;
        },
        // 弹出菜单宽度
        ctxMenuWidth() {
            if (this.popoverType === "popover") {
                if (this.devType === "onu" || this.devType === "splitter") {
                    return "240px";
                }
            }
            return "180px";
        },
        onuName() {
            return `${this.popoverData.port_id}/${this.popoverData.onu_id}`;
        },
        find() {
            if (!this.findStr) {
                this.findFlag = false;
                this.index = 0;
                this.nodes = [];
            }
            return this.findFlag && !!this.findStr;
        },
    },
    created() {
        this.getData();
    },
    inject: ["updateNavScrollbar"],
    updated() {
        this.$nextTick(() => {
            this.updateNavScrollbar();
        });
    },
    mounted() {
        this.setRect();
        const fn = throttle(this.setRect, 300, this);
        // 鼠标弹起时，若目标节点没有绑定事件处理，则隐藏popover
        const mouseup = (e) => {
            // 全局鼠标事件捕捉
            if (this.visible) {
                const scene = this.scene;
                if (!scene.selectedElements.length) {
                    this.visible = false;
                } else {
                    const len = scene.selectedElements.length;
                    const node = scene.selectedElements[len - 1];
                    if (node.elementType !== "node") {
                        this.visible = false;
                        // 防止按住ctrl多选节点
                        scene.selectedElements = [];
                    }
                }
            }
        };
        // 滚动时隐藏popover和node上触发的右键菜单
        const scrollFn = throttle(
            () => {
                if (this.visible) {
                    this.visible = false;
                }
            },
            300,
            this
        );
        window.addEventListener("resize", fn, true);
        window.addEventListener("mouseup", mouseup, false);
        window.addEventListener("scroll", scrollFn, true);
        this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("resize", fn);
            window.removeEventListener("mouseup", mouseup);
            window.removeEventListener("scroll", scrollFn);
        });
        this.stage = new JTopo.Stage(this.$refs.topo);
    },
    methods: {
        ...mapActions(["getPon", "getOntList"]),
        getData() {
            this.getPon().then((ponlist) => {
                this.ponList = ponlist;
                this.$nextTick(() => {
                    this.draw();
                });
            });
        },
        getSpliters(port_id) {
            this.splitterList = [];
            this.getOntList(port_id);
            return this.$http
                .get("/ponmgmt?form=splitter&port_id=" + port_id)
                .then((res) => {
                    if (res.data.code === 1) {
                        if (isArray(res.data.data)) {
                            this.splitterList = res.data.data;
                        }
                    }
                    return Promise.resolve(res.data.data || []);
                })
                .catch((err) => {});
        },
        //  检测页面宽高，调整canvas的大小
        setRect() {
            const { width, height } = document.body.getBoundingClientRect();
            this.clientWidth = width;
            // 去除头部导航栏高度(70px)以及底部footer高度(30px)
            this.clientHeight = height - 100;
            this.height = height - 100;
            this.$nextTick(() => {
                this.draw();
            });
        },
        draw() {
            this.initScene();
            this.initView();
        },
        // 初始化场景
        initScene() {
            if (this.scene) {
                this.scene.clear();
                this.scene = null;
            }
            this.scene = new JTopo.Scene(this.stage);
            this.scene.translate = false;
        },
        createNode(label, data, scene, flag = false) {
            const node = new JTopo.Node();
            node.fontColor = "0,0,0";
            if (data) {
                if (
                    data.status === 0 ||
                    (isDef(data.rstate) && data.rstate !== 1)
                ) {
                    node.fontColor = "255, 0, 0";
                }
            }
            node.text = label;
            node.data = data;
            node.dragable = flag;
            scene.add(node);
            return node;
        },
        addLine(nodeA, nodeZ, scene) {
            const link = new JTopo.Link(nodeA, nodeZ);
            link.strokeColor = "204,204,204";
            link.lineWidth = 1;
            scene.add(link);
            return link;
        },
        initView() {
            if (!this.ponList.length && !this.onulist.length) {
                return;
            }
            if (this.ponNode) {
                this.drawSinglePon(this.ponNode.data);
            } else {
                this.drawAllOnu();
            }
        },
        // 计算node位置
        deployNode(node, type, total, data, index, step) {
            this.bindEvent(node, type, data);
            const { width, height } = node.getBound();
            const Actions = {
                root() {
                    const root_y = this.baseStep;
                    const x = (this.width - width) / 2,
                        y = root_y;
                    node.setLocation(x, y);
                },
                pon(data) {
                    if (!this.ponNode) {
                        const pon_y = this.baseStep * 2;
                        const baseWidth = this.width / total;
                        const x = (baseWidth - width) / 2 + index * baseWidth,
                            y = pon_y;
                        node.setLocation(x, y);
                    } else {
                        const root_y = this.baseStep;
                        const x = (this.width - width) / 2,
                            y = root_y;
                        node.setLocation(x, y);
                    }
                },
                onu(data) {
                    let baseWidth = width * 2;
                    const count = Math.floor(this.width / baseWidth);
                    baseWidth = Math.floor(this.width / count);
                    // if (!this.ponNode) {
                    //     const x =
                    //         (baseWidth - width) / 2 +
                    //         (index % count) * baseWidth;
                    //     const y =
                    //         this.baseStep * 3 +
                    //         Math.floor(index / count) * this.baseStep;
                    //     node.setLocation(x, y);
                    // } else {
                    // 行数量少于最大排列数时，拉大间距居中显示
                    const x =
                            total > count
                                ? (baseWidth - width) / 2 +
                                  (index % count) * baseWidth
                                : this.width / total / 2 -
                                  width / 2 +
                                  index * (this.width / total),
                        y =
                            this.baseStep * (step + 2) +
                            Math.floor(index / count) * this.baseStep;
                    node.setLocation(x, y);
                    if (y + this.baseStep > this.height) {
                        this.height = this.baseStep + y;
                    }
                    // }
                },
            };
            typeof Actions[type] === "function" &&
                Actions[type].call(this, data);
        },
        bindEvent(node, type, data) {
            const Actions = {
                root() {
                    node.click((e) => {
                        if (this.ponNode) {
                            this.ponNode = null;
                            this.draw();
                        }
                    });
                },
                pon(data) {
                    node.click((e) => {
                        if (this.ponNode) {
                            // 单PON口视图时
                            this.ponNode = null;
                            this.draw();
                        } else {
                            // 全局视图时
                            this.ponNode = node;
                            this.changeView();
                        }
                    });
                    node.mouseover((e) => {
                        this.mouseover(node, "pon");
                    });
                    node.mouseout((e) => {
                        this.mouseout(node, "pon");
                    });
                    node.mouseup((e) => {
                        if (e.button === 2) {
                            this.contextMenu(node, "pon", e);
                        }
                    });
                },
                onu(data) {
                    node.mouseover((e) => {
                        this.mouseover(node, "onu");
                    });
                    node.mouseout((e) => {
                        this.mouseout(node, "onu");
                    });
                    node.mouseup((e) => {
                        if (e.button === 2) {
                            this.contextMenu(node, "onu", e);
                        } else if (e.button === 0) {
                            //  绘制单PON口时才能触发
                            if (this.ponNode) {
                                this.showCurrNodePath(data, "onu");
                            }
                        }
                    });
                },
                splitter(data) {
                    node.mouseover((e) => {
                        this.mouseover(node, "splitter");
                    });
                    node.mouseout((e) => {
                        this.mouseout(node, "splitter");
                    });
                    node.mouseup((e) => {
                        if (e.button === 2) {
                            this.contextMenu(node, "splitter", e);
                        } else if (e.button === 0) {
                            this.showCurrNodePath(data, "splitter");
                        }
                    });
                },
            };
            typeof Actions[type] === "function" &&
                Actions[type].call(this, data);
        },
        showCurrNodePath(data, type) {
            this.showOnuLine = false;
            if (data.parent === 0) {
                this.drawSplitters(this.splitterList.slice(), this.onulist);
                return;
            }
            /**
             * 每次重绘之前，重置一下整体数据
             * 否则会出现上次修改过的数据，影响当前视图的问题
             */
            this.splitterTree(this.splitterList);

            const onulist =
                type === "onu"
                    ? [data]
                    : this.onulist.filter(
                          (item) => item.parent === data.splitter_id
                      );
            this.showOnuLine = type === "onu";
            const res = (node) => {
                const parent = this.splitterList.filter(
                    (item) => item.splitter_id === node.parent
                )[0];
                if (parent && !node.identifier) {
                    parent.children = [node];
                }
                return parent;
            };
            let list = res(data);
            while (list && list.parent) {
                list = res(list);
            }

            this.drawSplitters(list ? [list] : [], onulist);
        },
        changeView() {
            this.index = 0;
            this.nodes = [];
            this.findStr = "";
            this.draw();
        },
        // 全景
        drawAllOnu() {
            const scene = this.scene;
            this.showOnuLine = false;
            // root node
            const root = this.createNode(this.hostname || "root", null, scene);
            this.deployNode(root, "root");
            // PON nodes
            const ponNum = this.ponList.length;

            this.ponList.forEach((item, index) => {
                const title = `PON${
                    item.port_id > 9 ? item.port_id : "0" + item.port_id
                }`;
                const pon = this.createNode(title, item, scene);
                this.deployNode(pon, "pon", ponNum, item, index);
                this.addLine(root, pon, scene);
            });
        },
        // 单PON口
        drawSinglePon(data) {
            const loading = this.$loading();
            Promise.all([
                this.getSpliters(data.port_id),
                this.getOntList(data.port_id),
            ])
                .then(([splitterlist, onulist]) => {
                    this.drawSplitters(splitterlist, onulist);
                })
                .catch(() => {})
                .finally(() => {
                    loading.close();
                });
        },
        splitterTree(list) {
            return list.reduce((pre, item) => {
                if (item.parent === 0) {
                    pre.push(item);
                } else {
                    const fn = (arr, item) => {
                        arr.forEach((v) => {
                            if (v.splitter_id === item.parent) {
                                if (!v.children) {
                                    v.children = [];
                                }
                                if (v.children.includes(item)) {
                                    removeItem(v.children, item);
                                }
                                v.children.push(item);
                                return;
                            }
                            if (v.children) {
                                fn(v.children, item);
                            }
                        });
                    };
                    fn(pre, item);
                }
                return pre;
            }, []);
        },
        drawSplitters(list, onulist) {
            this.scene.clear();
            this.height = this.clientHeight;
            const pon = this.createNode(
                `PON${this.ponNode.data.port_id}`,
                this.ponNode.data,
                this.scene
            );
            this.deployNode(pon, "pon");
            const splitterList = this.splitterTree(list),
                first = splitterList.length,
                second = splitterList.reduce((pre, item) => {
                    if (item.children) {
                        pre += item.children.length;
                    }
                    return pre;
                }, 0),
                third = splitterList.reduce((pre, item) => {
                    if (item.children) {
                        pre += item.children.reduce((p, v) => {
                            if (v.children) {
                                p += v.children.length;
                            }
                            return p;
                        }, 0);
                    }
                    return pre;
                }, 0);
            /**
             * @param {Ojbect}item 数据项
             * @param {number}index x轴偏移量
             * @param {Jtopo.Node}praentNode 当前节点的父节点
             * @param {number}count 当前行的节点数量
             * @param {number}step y轴偏移量
             * @returns {Jtopo.Node} 返回创建的节点
             */
            const createNode = (item, index, parentNode, count, step) => {
                const node = this.createSplitterNode(item, count);
                this.deploySplitter(node, count, index, step);
                this.addLine(parentNode, node, this.scene);
                item.node = node;
                return node;
            };
            // 偏移量
            let offset_y = 0,
                s_x = 0,
                t_x = 0;
            splitterList.forEach((item, index) => {
                let step = 1;
                offset_y < step && (offset_y = step);
                const node = createNode(item, index, pon, first, step);
                this.bindEvent(node, "splitter", item);
                item.hasNextlayer = true;
                if (item.children) {
                    item.children.forEach((_item, _index) => {
                        step = 2;
                        offset_y < step && (offset_y = step);
                        const _node = createNode(
                            _item,
                            s_x++,
                            node,
                            second,
                            step
                        );
                        this.bindEvent(_node, "splitter", _item);
                        _item.hasNextlayer = true;
                        if (_item.children) {
                            _item.children.forEach((__item, __index) => {
                                step = 3;
                                offset_y < step && (offset_y = step);
                                const __node = createNode(
                                    __item,
                                    t_x++,
                                    _node,
                                    third,
                                    step
                                );
                                this.bindEvent(__node, "splitter", __item);
                                __item.hasNextlayer = false;
                            });
                        }
                    });
                }
            });
            onulist.forEach((item, index) => {
                const port_id = (item.identifier >> 8) & 0xff,
                    ont_id = item.identifier & 0xff;
                const title = `${port_id}/${ont_id}`;
                const onu = this.createNode(title, item, this.scene);
                this.deployNode(
                    onu,
                    "onu",
                    onulist.length,
                    item,
                    index,
                    offset_y
                );
                if (this.showOnuLine) {
                    const parent = this.splitterList.filter(
                        (node) => node.splitter_id === item.parent
                    )[0];
                    this.addLine(parent ? parent.node : pon, onu, this.scene);
                }
            });
        },
        createSplitterNode(data, count) {
            const node = new JTopo.Node();
            node.fontColor = "0,0,0";
            node.text = count > 20 ? "" : data.name;
            node.data = data;
            node.dragable = false;
            node.setImage(splitterImg);
            this.scene.add(node);
            return node;
        },
        deploySplitter(node, count, index, step) {
            const { width } = node.getBound(),
                y = this.baseStep * (step + 1),
                baseWidth = this.width / count,
                x = (baseWidth - width) / 2 + index * baseWidth;
            node.setLocation(x, y);
        },
        mouseover(node, type) {
            this.popoverType = "popover";
            this.devType = type;
            this.popoverData = node.data;
            // 不加nextTick时，菜单大小还未调整完成，会导致菜单错位
            this.$nextTick(() => {
                this.position = this.computedPosition(node, this.popoverType);
                this.visible = true;
            });
        },
        mouseout(node, type) {
            if (this.popoverType === "popover") {
                this.visible = false;
            }
            node.selected = false;
        },
        contextMenu(node, type, e) {
            // 先隐藏，调整好弹出位置再显示
            this.visible = false;
            this.popoverType = "contextmenu";
            this.devType = type;
            this.popoverData = node.data;
            this.$nextTick(() => {
                this.position = this.computedPosition(
                    node,
                    this.popoverType,
                    e
                );
                this.visible = true;
            });
        },
        computedPosition(node, type, e) {
            const {
                left,
                right,
                top,
                bottom,
                width,
                height: _height,
            } = node.getBound();
            // popover离节点的高度
            const baseGutter = 10;
            // 滚动条偏移量
            const scrollHeight = this.$el.scrollTop;
            // 顶部菜单高度
            const topMenuHeight = 70;
            //  12为文本高度
            const height = _height + 12;
            // 页面可视区域宽高
            const clientWidth = this.width,
                clientHeight = this.clientHeight;
            // popover的宽高
            const { width: popwidth, height: popheight } = this.$refs[
                "popover"
            ].$el.getBoundingClientRect();
            let offset_x = 0,
                offset_y = 0;
            if (type === "popover") {
                let placement;
                if (top - scrollHeight > popheight) {
                    offset_y = top - popheight - baseGutter;
                    placement = "top";
                } else {
                    offset_y = top + height + baseGutter;
                    placement = "bottom";
                }
                offset_x = left - (popwidth - width) / 2;
                if (offset_x < 0) {
                    offset_x = left;
                    placement += "-start";
                }
                if (offset_x + popwidth > clientWidth) {
                    offset_x = right - popwidth;
                    placement += "-end";
                }
                this.placement = placement;
            }
            if (type === "contextmenu") {
                this.placement = "";
                const { clientX, clientY } = e;
                (offset_x = clientX),
                    (offset_y = clientY + scrollHeight - topMenuHeight);
                if (offset_x + popwidth > clientWidth) {
                    offset_x = offset_x - popwidth;
                }
                if (offset_y + popheight > clientHeight + scrollHeight) {
                    offset_y = offset_y - popheight;
                }
            }
            return { x: offset_x, y: offset_y };
        },
        composeData(devType, action) {
            return {
                type: devType,
                action,
                data: this.popoverData,
            };
        },
        commandHandle(command) {
            const { type, action, data } = command;
            if (type === "pon") {
                sessionStorage.setItem("pid", data.port_id);
            }
            const TYPES = {
                pon: {
                    // sla_cfg() {
                    //     this.$router.push("/sla_cfg");
                    // },
                    pon_setting() {
                        this.$router.push("/pon_setting");
                    },
                    pon_optical() {
                        this.$router.push("/pon_optical");
                    },
                    // batch_config() {
                    //     this.$router.push("/batch_config");
                    // },
                },
                onu: {
                    detail(data) {
                        const url = `/onu_basic_info?form=base-info&port_id=${
                            (data.identifier >> 8) & 0xff
                        }&onu_id=${data.identifier & 0xff}`;
                        this.$router.push(url);
                    },
                    onu_port_cfg(data) {
                        sessionStorage.setItem(
                            "port_id",
                            (data.identifier >> 8) & 0xff
                        );
                        sessionStorage.setItem(
                            "ont_id",
                            data.identifier & 0xff
                        );
                        this.$router.push(`/onu_port_cfg`);
                    },
                    del_onu(data) {
                        this.$confirm(this.$lang("tips_del_onu") + " ?")
                            .then(() => {
                                const url = "/gponont_mgmt?form=auth";
                                const post_params = {
                                    method: "delete",
                                    param: {
                                        identifier: [data.identifier],
                                    },
                                };
                                this.postData(url, post_params)
                                    .then(() => {
                                        this.getData();
                                    })
                                    .catch(() => {});
                            })
                            .catch(() => {});
                    },
                    add_to_deny(data) {
                        this.$confirm(this.$lang("tips_add_deny_onu"))
                            .then(() => {
                                const url = "/gponont_mgmt?form=auth";
                                const post_params = {
                                    method: "reject",
                                    param: {
                                        identifier: [data.identifier],
                                    },
                                };
                                this.postData(url, post_params)
                                    .then(() => {
                                        this.getData();
                                    })
                                    .catch(() => {});
                            })
                            .catch(() => {});
                    },
                    reboot_onu(data) {
                        this.$confirm(this.$lang("confirm_reboot_onu"))
                            .then(() => {
                                const url = "/gponont_mgmt?form=info";
                                const post_params = {
                                    method: "set",
                                    param: {
                                        identifier: data.identifier,
                                        flags: 0x4,
                                        ont_name: data.ont_name,
                                        ont_description: data.ont_description,
                                    },
                                };
                                this.postData(
                                    url,
                                    post_params,
                                    `${this.$lang("reboot_onu", "st_success")}`
                                )
                                    .then(() => {
                                        this.getData();
                                    })
                                    .catch(() => {});
                            })
                            .catch(() => {});
                    },
                },
                splitter: {
                    bindOnu(data) {
                        this.openDialog("bind", data);
                    },
                    addNextlayer(data) {
                        this.openDialog("add", data);
                    },
                    delSplitter(data) {
                        this.$confirm(
                            this.$lang("if_sure") + this.$lang("delete") + " ?"
                        )
                            .then(() => {
                                this.postData(
                                    "/ponmgmt?form=splitter",
                                    {
                                        method: "delete",
                                        param: {
                                            port_id: data.port_id,
                                            splitter_id: data.splitter_id,
                                            name: data.name,
                                            description: data.description,
                                            parent: data.parent,
                                        },
                                    },
                                    this.$lang("delete") +
                                        this.$lang("st_success")
                                )
                                    .then(() => {
                                        this.drawSinglePon(this.ponNode.data);
                                    })
                                    .catch(() => {});
                            })
                            .catch(() => {});
                    },
                    config(data) {
                        this.openDialog("config", data);
                    },
                },
            };
            if (TYPES[type] && typeof TYPES[type][action] === "function") {
                TYPES[type][action].call(this, data);
            }
            this.visible = false;
        },
        postData(url, data, suc_text) {
            const message = suc_text || this.$lang("setting_ok");
            return this.$http
                .post(url, data)
                .then((res) => {
                    if (res.data.code === 1) {
                        this.$message.success(message);
                        return Promise.resolve(res);
                    } else {
                        this.$message.error(
                            `(${res.data.code}) ${res.data.message}`
                        );
                        return Promise.reject(res);
                    }
                })
                .catch((err) => {});
        },
        refreshImage() {
            this.findStr = "";
            this.index = 0;
            this.nodes = [];
            this.$root.$el.scrollTo(0, 0);
            debounce(this.getData, 1000, this);
        },
        saveAsImage() {
            this.stage.saveImageInfo();
        },
        findNode() {
            if (this.findStr === "") return;
            this.findFlag = true;
            const scene = this.scene;
            this.nodes = scene.childs.filter((item) => {
                let flag = false;
                if (item.data) {
                    if (typeof item.data.onu_name === "string") {
                        if (
                            item.data.onu_name
                                .toLowerCase()
                                .indexOf(this.findStr.toLowerCase()) > -1
                        ) {
                            flag = true;
                        }
                    }
                    if (typeof item.data.macaddr === "string") {
                        if (
                            item.data.macaddr
                                .toLowerCase()
                                .indexOf(this.findStr.toLowerCase()) > -1
                        ) {
                            flag = true;
                        }
                    }
                }
                return item instanceof JTopo.Node && flag;
            });
            if (!this.nodes.length) {
                this.findFlag = false;
            }
            this.jumpToNode();
        },
        jumpToNode() {
            if (this.nodes.length) {
                const node = this.nodes[this.index];
                node.selected = true;
                const { top } = node.getBound();
                const scrollTop = top - this.clientHeight / 2;
                this.$root.$el.scrollTo(0, scrollTop);
                this.nodeFlash(node, 10);
            }
        },
        changeNode(flag) {
            const len = this.nodes.length;
            if (len === 0 || len === 1) return;
            if (flag === "prev") {
                this.index--;
                if (this.index < 0) {
                    this.index = len - 1;
                }
            } else {
                this.index++;
                if (this.index >= len) {
                    this.index = 0;
                }
            }
            this.jumpToNode();
        },
        nodeFlash(node, n) {
            if (n === 0) {
                node.visible = true;
                node.alarm = null;
                return;
            }
            node.visible = !node.visible;
            node.visible
                ? (node.alarm = node.data.macaddr)
                : (node.alarm = null);
            setTimeout(() => {
                this.nodeFlash(node, n - 1);
            }, 300);
        },
        openDialog(type, data) {
            this.initForm();
            this.dialogType = type;
            this.dialogVisible = true;
            if (type === "config") {
                Object.keys(this.formData).forEach((key) => {
                    if (isDef(data[key])) {
                        this.formData[key] = data[key];
                    }
                });
            }
        },
        submitForm() {
            let url, post_params, message;
            if (this.dialogType === "bind") {
                url = "/ponmgmt?form=splitterbindonu";
                post_params = {
                    method: "set",
                    param: {
                        port_id: this.popoverData.port_id,
                        splitter_id: this.popoverData.splitter_id,
                        onulist: this.formData.onulist,
                    },
                };
            }
            if (this.dialogType === "add" || this.dialogType === "config") {
                if (this.formData.name.length > 16) {
                    return this.$message.error(
                        this.$lang("param_error") + ": " + this.$lang("name")
                    );
                }
                if (this.formData.description.length > 64) {
                    return this.$message.error(
                        this.$lang("param_error") + ": " + this.$lang("desc")
                    );
                }
                url = "/ponmgmt?form=splitter";
                post_params = {
                    method: this.dialogType === "add" ? "add" : "set",
                    param: {
                        port_id: this.popoverData.port_id,
                        name: this.formData.name,
                        description: this.formData.description,
                        parent: this.popoverData.splitter_id,
                        splitter_id:
                            this.dialogType === "config"
                                ? this.popoverData.splitter_id
                                : undefined,
                    },
                };
                message =
                    this.dialogType === "add"
                        ? this.$lang("add") + this.$lang("st_success")
                        : undefined;
            }
            url &&
                post_params &&
                this.postData(url, post_params, message)
                    .then(() => {
                        if (this.dialogType === "bind") {
                            this.getData();
                            return;
                        }
                        this.drawSinglePon(this.ponNode.data);
                    })
                    .catch(() => {})
                    .finally(() => {
                        this.dialogVisible = false;
                    });
        },
        initForm() {
            this.formData.name = "";
            this.formData.description = "";
            this.formData.onulist = [];
        },
        validName(rule, val, cb) {
            if (this.dialogType !== "add" && this.dialogType !== "config") {
                return cb();
            }
            if (!regLength(val, 0, 16)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 16)));
            }
            cb();
        },
        validDesc(rule, val, cb) {
            if (this.dialogType !== "add" && this.dialogType !== "config") {
                return cb();
            }
            if (!regLength(val, 0, 64)) {
                return cb(new Error(this.validateMsg("inputLength", 0, 64)));
            }
            cb();
        },
    },
};
</script>

<style lang="less" scoped>
input[type="text"] {
    text-indent: 10px;
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    border: 1px solid @borderColor;
    border-radius: 3px;
    outline: 0;
    text-decoration: none;
}
input[type="text"]:focus {
    border: 1px solid @titleColor;
    border-radius: 3px;
}
.topo {
    width: 100%;
    height: calc(~"100% - 100px");
    position: relative;
}
.device-info {
    > div {
        display: table;
        width: 100%;
        span {
            display: table-cell;
            width: 40%;
            padding: 6px 0;
            text-align: center;
            vertical-align: baseline;
            &:last-child {
                text-align: left;
                width: 57%;
                word-wrap: break-word;
                word-break: break-word;
            }
        }
        &:after {
            content: "";
            display: table;
            clear: both;
        }
    }
}
.topo-toolbar {
    position: absolute;
    top: 0px;
    right: 0px;
    background: #ddd;
    padding: 6px 12px;
    user-select: none;
    border-radius: 3px;
    border-bottom: 1px solid #ccc;
    > span {
        display: inline-block;
        padding: 0 12px;
        cursor: pointer;
        vertical-align: middle;
        &:hover {
            color: @titleColor;
        }
    }
    svg {
        vertical-align: middle;
    }
    input {
        vertical-align: middle;
    }
    input + span:hover {
        color: @titleColor;
    }
}
.dialog-splitter-item {
    margin: 12px 0;
    > span {
        display: inline-block;
        vertical-align: baseline;
        &:first-child {
            width: 120px;
            text-align: right;
            padding-right: 20px;
        }
    }
    > textarea {
        vertical-align: top;
        font-size: 16px;
        line-height: 20px;
        border: 1px solid @borderColor;
        padding: 0 5px;
        resize: none;
        border-radius: 3px;
        &:focus {
            border-color: @titleColor;
            outline: none;
        }
    }
    > span.onu-list-item {
        width: 410px;
        max-height: 350px;
        overflow-y: scroll;
        vertical-align: top;
        > label {
            display: inline-block;
            vertical-align: baseline;
            width: 25%;
            line-height: 24px;
        }
    }
    .tips {
        font-size: @baseFontSize;
        color: @tipsColor;
    }
}
</style>