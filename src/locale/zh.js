var zh = {
    advanced: "高级",
    running_status: "运行状态",
    system_mgmt: "系统管理",
    dev_mgmt: "设备管理",
    default_config: "恢复出厂配置",
    backup_config: "备份配置",
    restore_config: "导入配置",
    reboot: "重启",
    diagonose: "诊断工具",
    remote_mgmt: "网络接口",
    outbound: "带外接口",
    inbound: "带内接口",
    upgrade: "升级管理",
    firmware: "固件升级",
    system: "系统升级",
    time: "时间管理",
    pon_mgmt: "PON管理",
    onu_allow: "ONT列表",
    onu_deny: "ONT阻止列表",
    sla_cfg: "带宽配置",
    pon_setting: "PON设置",
    onu_mgmt: "ONT管理",
    onu_basic_info: "ONT基本信息",
    onu_port_cfg: "ONT端口配置",
    swport_mgmt: "端口管理",
    port_info: "端口信息",
    perf_info: "统计信息",
    port_cfg: "端口配置",
    vlan_cfg: "VLAN配置",
    stormctrl_cfg: "风暴控制",
    port_mirror: "端口镜像",
    layer2_mgmt: "交换管理",
    vlan_mgmt: "VLAN管理",
    mac_mgmt: "MAC地址管理",
    protocol_mgmt: "协议管理",
    rstp: "RSTP",
    tips: "提示",
    create: "创建",
    destroy: "删除",
    add: "增加",
    delete: "删除",
    modify: "修改",
    find: "查找",
    apply: "确认",
    set: "设置",
    commit: "提交",
    cancel: "取消",
    config: "配置",
    enable: "使能",
    disable: "未使能",
    full: "全双工",
    half: "半双工",
    type: "类型",
    using: "启用",
    forbidden: "禁用",
    st_success: "成功",
    st_fail: "失败",
    range: "范围",
    onu_info: "ONT信息",
    user_mgmt: "用户管理",
    user: "用户",
    user_name: "用户名",
    password: "密码",
    modify_user_pwd: "修改当前用户密码",
    title: "名称",
    key: "密钥",
    info: "信息",
    download: "下载",
    on: "开启",
    off: "关闭",
    advanced_setting: "高级设置",
    save: "保存",

    upgrade_firmware: "升级固件",
    upgrade_system: "升级系统",
    pon_auth: "PON鉴权",
    auth_type: "鉴权类型",
    macaddr: "MAC地址",
    macmask: "MAC掩码",
    ponports: "PON口数量",
    geports: "千兆口数量",
    xgeports: "XGE口数量",
    feports: "百兆口数量",
    build_time: "编译时间",
    sys_ver: "系统版本",
    fw_ver: "固件版本号",
    hw_ver: "硬件版本号",
    voip: "VoIP",
    wlan: "WLAN",
    usb: "USB",
    catv: "CATV",

    cpu_usage: "CPU使用率",
    memory_usage: "内存使用率",

    port_id: "端口号",
    status: "状态",
    online: "在线",
    offline: "离线",

    admin_status: "管理状态",
    link_status: "链路状态",
    link_up: "连接",
    link_down: "未连接",
    auto_neg: "自适应",
    speed: "速率",
    duplex: "双工",
    flow_ctrl: "流控",
    pvid: "缺省VLAN",
    media: "端口媒介",
    copper: "Copper",
    fiber: "Fiber",
    erate: "出口速率",
    irate: "入口速率",

    ipaddr: "IP地址",
    ipmask: "IP掩码",
    mtu: "最大传输单元",
    interface: "接口",
    count: "次数",
    pktsize: "包大小",
    timeout: "超时",

    rcvpkts: "接收包数",
    rcvbytes: "接收包字节数",
    transpkts: "发送包数",
    transbytes: "发送包字节数",

    current_time: "当前时间",
    run_time: "运行时间",
    days: "天",
    hours: "时",
    mins: "分",
    secs: "秒",

    search_by_macaddr: "输入mac地址查找ONT,支持部分匹配查找",
    onu_id: " ONT ID",
    onu_name: "名称",
    onu_desc: "描述信息",
    auth_state: "认证状态",
    tips_cfm_onu: "表示当前ONT已认证,点击可以取消认证状态",
    tips_active_state: "是否确认激活此ONT ?",
    tips_deactive_state: "是否确认要解除当前ONT的激活状态 ?",
    tips_n_cfm_onu: "表示当前ONT未认证,点击可以进行认证",
    tips_authstate_error: "ONT未处于online状态，无法进行此操作",
    tips_onu_btn_detail: "查看ONT详细信息",
    tips_page_refresh: "刷新当前页面",
    click: "点击",
    onudeny_add_tips:
        "点击增加按钮，手动添加ONT到阻止列表，需要参数MAC地址(必填)，描述信息(选填)",
    onudeny_del_tips: "将当前ONT从阻止列表移除",
    tips_onu_btn_del: "删除当前ONT",
    tips_onu_btn_rej: "将当前ONT到阻止列表",
    tips_onu_restart: "重启ONT",
    register_time: "注册时间",
    rtt: "注册往返时间",
    retry: "重复次数",
    deregister_onu: "解注册ONT",
    set_fec_mode: "更改fec-mode",
    confirm_reboot_onu: "是否确认重启该ONT",
    confirm_deresgester: "是否确认解注册该ONT",
    confirm_change_fecmode: "是否确认更改该ONT的fec mode",

    sla_type: "带宽类型",
    fix: "固定带宽",
    assure: "保证带宽",
    max: "最大带宽",
    fix_range_err: "固定带宽超出范围",
    assure_range_err: "保证带宽超出范围",
    max_range_err: "最大带宽超出范围",
    fix_param_err: "固定带宽大小不能超过保证带宽或最大带宽",
    assure_param_err: "保证带宽大小不能超过最大带宽",

    auth_mode: "认证模式",
    onu_type: "ONT类型",
    dev_type: "设备类型",
    vendor: "厂商",
    sn_model: "SN型号",
    chip_model: "芯片型号",
    onu_chip: "芯片厂商",
    software_ver: "软件版本",
    hardware_ver: "硬件版本",

    tips_del_onu: "是否确认删除该ONT",
    tips_add_deny_onu: "是否确认添加到阻止列表",

    port_type: "端口类型",
    vlan_mode: "VLAN模式",
    tagged: "标记",
    untagged: "去标记",

    stormctrl: "风暴抑制",
    broadcast: "广播",
    multicast: "组播",
    unicast: "单播",
    stormctrl_tips: "全为0时表示关闭风暴控制",

    mirror: "端口镜像",
    src_port: "源端口",
    dst_port: "目的端口",
    choose: "请选择",

    age: "老化时间",
    mac_type: "MAC地址类型",
    blackhole: "黑洞",
    static: "静态",
    dynamic: "动态",
    vlan_id: "VLAN ID",
    tips_del_mac: "是否确认删除该MAC地址表项",
    add_mac: "添加MAC",
    flush_mac: "清除MAC",
    flush_way: "清除方式",

    flush: "清除",
    desc: "描述信息",
    loadmore: "加载更多",
    vlan_list: "VLAN列表",
    detail: "详情",
    query_method: "查询方式",
    mac_index: "序号",

    rstp_mode: "模式",
    rb_priority: "根桥优先级",
    rb_address: "根桥地址",
    db_priority: "指定桥优先级",
    db_address: "指定桥地址",
    max_age: "BPDU最大生存期",
    hello_time: "BPDU发送周期",
    forward_delay: "端口状态延时",
    transmit_hold_count: "BPDU限制速率",
    root_path_cost: "根桥路径开销",

    port_priority: "优先级",
    port_path_cost: "路径开销",
    edge_status: "边缘端口",
    admin_link_type: "链路管理状态",
    oper_link_type: "链路运行状态",
    port_role: "角色",
    port_state: "状态",
    auto: "Auto",
    p2p: "P2P",
    shared: "Shared",

    interface_cfg: "接口项不同时的可配置选项",
    bound_tips:
        "带外接口和带内接口可配置IP地址和IP掩码，须为有效的IP地址和IP掩码",
    add_inbound_tips: "增加只能增加带内接口，须配置IP地址，IP掩码和VLAN ID",

    http_login_timeout: "登录超时，请重试",
    service_user_password_fail: "用户名或密码验证失败",
    login_success: "登录成功,欢迎使用",
    login_user: "登录",
    current_user_list: "当前已有用户列表",
    password_length_fail: "密码限定长度为4-64位",
    username_length_fail:
        "请输入符合规范的4-32位用户名，不能输入中文、空格和特殊字符",
    pwd_not_match: "两次输入的密码不一致",
    current_pwd: "当前密码",
    new_pwd: "新密码",
    cfm_pwd: "确认密码",
    user_level: "用户权限",
    user_reenter: "最大登录次数",
    modify_success: "修改成功，请使用新密码重新登录",
    login_out: "成功退出登陆",
    login_page_login_hit: "请登录以管理OLT",
    login_timeout: "登录超时，请重新登录",
    illegal_login_info: "非法登录信息",
    logout: "退出登录",
    no_support: "暂未支持",
    setting_ok: "设置成功",
    delete_ok: "删除成功",
    delete_fail: "删除失败",
    setting_fail: "设置失败",
    tips_create_vlan: "点击以创建新的VLAN并增加端口",
    create_vlan_info: "创建VLAN成功，正在应用VLAN配置",
    delete_vlan_hit: "是否确认删除此VLAN?",
    vlanid_range_hit: "VLAN ID取值范围应该为1-4094之间的数字",
    not_find_vlan: "没有找到指定的VLAN",
    restore_config_fail: "导入配置失败",
    restore_config_succ: "导入配置成功，重启设备后生效",
    restore_succ_reboot: "导入配置成功，是否现在重启设置",
    save_succ: "保存配置成功",
    save_config: "保存配置",
    restore_file_nr: "文件格式不正确",
    file_not_select: "当前未选择任何文件",
    file_click: "点击选择文件",
    default_config_fail: "恢复出厂设置失败",
    def_cfg_succ: "恢复出厂设置成功，即将重启设备",
    reboot_olt_hit: "是否确认重启设备?",
    def_cfg_hit: "恢复出厂设置后，设备将会重启",
    def_cfg_info:
        "请注意，恢复出厂设置后，设备将恢复至出厂时的状态，所有自定义的设置将会丢失，如您需要保存现有配置，请备份当前配置",
    save_cfg_confirm: "将会保存当前的所有已进行的设置，是否确认",
    save_cfg_info: "将当前的所有已进行的配置进行保存，并写入设备",
    res_cfg_info: "您可以通过导入配置文件来恢复您备份的配置",
    bkup_cfg_info:
        "我们建议您在升级软件或进行修改配置之前保存原有配置，点击备份按钮可以对当前配置进行备份",
    reboot_olt:
        "设备的部分配置修改需要重启设备才能生效，您可以通过点击重启按钮来重启设备。重启过程中请不要断电",
    view_cfg: "查看当前配置",
    view_cfg_tips: "点击下载当前所有配置(包含未保存的配置)",

    fullversion: "全版本升级",
    fv_upgrade_succ: "全版本升级成功",
    fv_upgrade_fail: "全版本升级失败",
    sys_upgrade_fail: "系统升级失败",
    sys_upgrade_succ: "系统升级成功，重启设备后生效",
    upgrade_buzy: "升级失败，当前有其他用户正在升级此设备",
    file_header_error: "升级失败，升级文件检测不匹配",
    fw_upgrade_fail: "固件升级失败",
    fw_upgrade_succ: "固件升级成功，重启设备后生效",
    upgrade_success: "升级成功，是否马上重启此设备",

    get_data_fail: "获取数据失败，请刷新或稍后再试...",

    onu_cfg: "ONT配置",
    onu_bw_fail_info: "当前端口下暂无ONT带宽信息",
    sys_run_time: "系统运行时间",

    hw_status: "硬件状态",
    sys_info: "系统信息",
    clk_port_cfg: "点击可进入端口配置",
    ge_port_info: "GE信息",
    clk_onu_allow: "点击可进入onu允许列表",
    registered_onu: "已注册设备数",
    pon_info: "PON口信息",
    rstp_port_pri: "设置rstp端口优先级",
    rstp_global_info: "设置rstp全局信息",
    rstp_p_pri_b: "设置端口优先级",

    rstp_p_info: "rstp端口信息",
    rstp_b_info: "rstp桥信息",

    no_inb_info: "当前没有带内接口",
    oub_con_fail: "带外接口连接失败",

    if_sure: "是否确认",

    flush_page_retry: "请刷新页面或稍后再试...",
    sw_port_cfg: "交换端口基本配置",
    no_more_data: "没有更多的数据了...",
    no_onu_info: "当前PON口下暂无ONT信息...",
    add_to_deny: "添加到阻止列表",
    confirm_del_deny: "确认从阻止列表移除此ONT?",
    del_onu: "删除ONT",
    clk_cancel_cfrm: "点此取消认证",
    clk_cfrm: "点此认证",
    input_desc: "输入描述信息",
    onu_offline_tips: "离线状态的 ONT 无法进行重启操作",

    zero_auto_: "为0或为空时，表示自动分配",
    manual_bind: "手动添加ONT",
    reboot_onu: "重启ONT",

    lang: "语言",
    modify_tips: "未进行任何修改",
    param_mac: "MAC地址格式不正确",
    param_onuid: "非法ONT ID",
    param_error: "非法参数",
    ipaddr_error: "IP地址格式错误",
    ipmask_error: "IP掩码格式错误",

    time_set: "时间",
    manual_s: "手动",
    time_days: "日期",
    time_year: "年",
    time_month: "月",
    time_day: "日",
    time_hour: "时",
    time_min: "分",
    time_sec: "秒",
    time_get_serv: "获取设备时间",
    time_set_local: "更新本地时间",
    notice_time_sync:
        "请注意，页面时间可能与服务器时间存在差异，可以点击按钮将本页面时间与服务器时间同步",
    update_time: "更新时间",
    diff_type_cfg: "不同type时的可配置选项",
    select_all: "全选",
    clear_all: "反选",

    onu_port_config: "ONT端口基本配置",
    onu_vlan_mode_cfg: "ONT端口VLAN模式配置",
    onu_port_id: "ONT端口号",
    onu_add_translate: "添加 ONT VLAN translate",
    onu_del_translate: "删除 ONT VLAN translate",
    onu_add_trunk: "添加 ONT VLAN trunk",
    onu_del_trunk: "删除 ONT VLAN trunk",
    vlan_pri_param_error: "VLAN优先级参数不正确",
    translate_exits: "要添加的转发已存在",
    trunk_vlanid_range_error: "VLAN ID 设置的范围超出",
    op_id: "ONT端口",
    rlds_opt: "下行限速",
    rl_cir: "保证速率",
    rl_pir: "峰值速率",
    rlus_opt: "上行限速",
    loopdetect: "环路检测",
    start_vlan_id: "起始VLAN",
    end_vlan_id: "结束VLAN",
    op_vlan_mode: "端口VLAN模式",
    def_vlan_id: "缺省VLAN",
    def_vlan_pri: "缺省VLAN优先级",
    new_vlan_pri: "VLAN优先级",
    vlan_pri: "VLAN优先级",
    bandwidth: "带宽",
    rstp_tips_disable: "全局RSTP桥未使能，无法进行此设置",

    work_temprature: "当前温度",
    work_voltage: "工作电压",
    transmit_bias: "传输电流",
    transmit_power: "发送光功率",
    receive_power: "接收光功率",
    refresh: "刷新",
    onu_optical_diagnose: "ONT光诊断",
    diag_tools_type: "诊断工具类型",
    dest_ping_ip: "目的IP地址",
    diag_ping_intf: "出接口",
    diag_ping_count: "PING次数",
    diag_ping_pktsize: "PING 数据包大小",
    diag_type: "Ping诊断",
    start: "开始",
    select_timezone: "选择时区",
    switch_display: "切换显示模式",
    service: "服务",
    click_often: "点击太过频繁",
    ntp_ipaddr1: "首选IP地址",
    ntp_ipaddr2: "备用IP地址",
    ntp_gettime: "自动获取时间",
    update_frequency: "更新频率",
    alarm: "告警",
    alarm_info: "告警信息",
    port_vlan: "端口VLAN",
    pv_vlist_tips:
        'VLAN列表可以是单个数字，也可以是一段连续的范围，范围起点和终点间用"-"分隔，每一项之间用","隔开。',
    pv_vmode_tips: "VLAN模式只有在端口类型为'hybrid'时才允许修改。",
    add_vlan_list: "将端口加入指定VLAN",
    del_vlan_list: "将端口从指定VLAN删除",
    svlan_pri: "SVLAN优先级",
    batch_mgmt_onu: "批量管理ONT",
    exit_batch_onu: "退出批量管理",
    no_select_onu: "当前未选择任何ONT",

    onu_batch_upgrade: "ONT批量升级",
    onu_upgrade_tips: '升级类型名只能由英文字母，数字和 " - " 组成',
    upgrade_type: "升级类型",
    upgrade_type_mgmt: "升级类型管理",
    onu_bind_upgrade_type: "ONT绑定升级类型",
    current_upgrade_type: "当前已有升级类型",
    select_upgrade_type: "选择升级类型",
    no_upgrade_type: "当前无可用的升级类型",
    add_onu_type: "添加ONT升级类型",
    del_onu_type: "删除ONT升级类型",
    onu_upgrade_start: "升级已开始，升级信息请在告警信息页面查看",

    igmp: "IGMP",
    fast_leave: "快速离开",
    protocol_policy: "协议策略",
    group_aging_time: "组播表老化时间",
    robustness: "健壮性",
    gen_response_time: "普遍组查询响应时间",
    gen_query_interval: "普遍组查询间隔",
    sp_response_time: "特定组查询响应时间",
    sp_query_interval: "特定组查询间隔",
    sp_query_number: "特定组查询次数",
    multi_ip: "组播IP",
    host_portlist: "端口成员",
    mc_unknown_policy: "未知多播策略",
    transparent: "透传",
    discard: "丢弃",
    mvlan: "组播VLAN",
    router_portlist: "路由端口",
    program: "组播节目",
    program_s: "组播节目起始",
    program_e: "组播节目结束",
    mode: "模式",
    query_src_ip: "查询报文源IP地址",
    query_src_mac: "查询报文源MAC地址",
    vid: "组播VLAN",
    program_range_tips: "节目有效地址范围：224.0.1.0-239.255.255.255",
    port_list_tips: "路由端口仅针对上联口，1表示GE1，2表示GE2...",

    onu_multicast: "ONT组播管理",
    mc_mode: "组播模式",
    mc_mac: "组播MAC地址",
    group_num_max: "最大组播组",
    tag_mode: "组播VLAN模式",
    mv_conversion_table: "组播VLAN转换表",
    op_multicast: "ONT端口组播",

    onu_alarm: "ONT告警信息",
    mvlan_desc: "组播VLAN描述信息",
    program_desc: "组播节目描述信息",

    batch_cfg_vlan: "批量配置VLAN端口",

    pon_optical: "PON口光诊断",
    pon_optical_tips: "这里是PON模块的RSSI，您需要选择您想要触发的ONT的位置",
    loading: "加载数据中，请稍候...",
    multicast_table: "组播表项",
    static_table: "静态表项",
    dynamic_table: "动态表项",
    tagged_portlist: "Tagged",
    untagged_portlist: "Untagged",
    onu_optical_tips: "你需要手动刷新来获取光功率数据",

    default_vlan_portlist: "As Default VLAN Port",
    def_vlan_tips: "当端口已配置该VLAN为缺省VLAN时，不允许配置该端口",
    auto_neg_tips: "自适应为未使能状态时，才能配置速率",

    logosize_tips: "LOGO大小限制为240*70px",
    product_name: "产品型号",
    company_info: "公司信息",
    company_name: "公司名称",
    company_addr: "公司地址",
    company_email: "公司邮箱",
    company_phone: "联系电话",
    product_name_tips: "产品名称不得多于12个字符",
    sysinfo_set: "Logo，型号，公司信息设置",
    goback_devmgmt: "回到设备管理",
    imagesize_tips: "图片大小最大为50kb",

    acl_id_range_error:
        "ACL ID取值范围错误，其中基础ACL为2000-2999，高级ACL为3000-4999，链路ACL为5000-5999",

    action: "行为",
    src_ipaddr: "源IP",
    src_ipmask: "源IP掩码",
    dst_ipaddr: "目的IP",
    dst_ipmask: "目的IP掩码",
    precedence: "Precedence",
    protocol: "协议",
    dscp: "DSCP",
    eth_type: "以太网类型",
    cos: "COS",
    inner_cos: "内层COS",
    inner_vlan_id: "内层VLAN ID",
    src_mac: "源MAC地址",
    dst_mac: "目的MAC地址",
    src_mask: "源MAC掩码",
    dst_mask: "目的MAC掩码",
    timerange: "时间范围",
    basic: "基本",
    link: "链路",
    rule: "规则",
    acl_mgmt: "ACL管理",
    show: "查看",
    rule_count: "规则数",
    rule_priority: "调整Rule优先级",
    show_rule: "查看规则",

    stime: "起始时间",
    etime: "结束时间",
    day: "日期",
    sday: "起始日期",
    eday: "结束日期",
    name: "名称",
    period: "时间",
    relative: "相对时间",
    absolute: "绝对时间",
    state: "状态",
    port_list: "端口列表",

    priority: "优先级",
    queue_scheduler: "队列调度程序",
    queue: "队列",
    weight: "权重",
    delete_all: "删除全部",
    show_detail: "查看详情",
    packet_filter: "包过滤",
    time_range: "时间范围",
    optional: "可选项",
    required: "必填",
    mask: "掩码",

    preference: "优先级",
    next_hop: "下一跳",
    route_cfg: "路由配置",
    static_route: "静态路由",
    route: "路由",
    route_mgmt: "路由管理",
    ARP: "ARP表",
    static_route_tips: "关闭路由功能将会清除所有路由表和ARP表",
    def_route: "缺省路由",

    loid_mgmt: "LOID允许列表",
    used: "绑定",
    loid: "LOID",
    ctcver: "CTC版本",
    onu_perf_info: "ONT统计信息",
    dsDropEvents: "下行丢弃事件数",
    usDropEvents: "上行丢弃事件数",
    dsOctets: "下行字节数",
    usOctets: "上行字节数",
    dsFrames: "下行报文数",
    usFrames: "上行报文数",
    dsBroadcastFrames: "下行广播报文数",
    usBroadcastFrames: "上行广播报文数",
    dsMulticastFrames: "下行组播报文数",
    usMulticastFrames: "上行组播报文数",
    dsCrcErrorFrames: "下行CRC错误报文数",
    usCrcErrorFrames: "上行CRC错误报文数",
    dsUndersizeFrames: "下行超短报文数",
    usUndersizeFrames: "上行超短报文数",
    dsOversizeFrames: "下行超长报文数",
    usOversizeFrames: "上行超长报文数",
    dsFragmentFrames: "下行Fragment数",
    usFragmentFrames: "上行Fragment数",
    dsJabberFrames: "下行Jabber数",
    usJabberFrames: "上行Jabber数",
    dsFrames64Octets: "下行长度为64字节报文数",
    dsFrames65to127Octets: "下行长度为65～127字节的报文数",
    dsFrames128to255Octets: "下行长度为128～255字节的报文数",
    dsFrames256to511Octets: "下行长度为256～511字节的报文数",
    dsFrames512to1023Octets: "下行长度为512～1023字节的报文数",
    dsFrames1024to1518Octets: "下行长度为1024～1518字节的报文数",
    usFrames64Octets: "上行长度为64字节报文数",
    usFrames65to127Octets: "上行长度为65～127字节的报文数",
    usFrames128to255Octets: "上行长度为128～255字节的报文数",
    usFrames256to511Octets: "上行长度为256～511字节的报文数",
    usFrames512to1023Octets: "上行长度为512～1023字节的报文数",
    usFrames1024to1518Octets: "上行长度为1024～1518字节的报文数",
    dsDiscardFrames: "下行丢弃报文数",
    usDiscardFrames: "上行丢弃报文数",
    dsErrorFrames: "下行错误报文数",
    usErrorFrames: "上行错误报文数",
    statusChangeTimes: "端口状态变化次数",
    onu_perf_status: "ONT端口统计状态",
    onu_perf_period: "ONT端口统计周期",
    clear_perf: "清除统计信息",
    curr_perf: "查看当前统计信息",
    history_perf: "查看历史统计信息",

    file_limit_img: "文件格式为 *.img",
    file_limit_zip: "文件格式为 *.zip",

    ld_status: "环路检测状态",
    recover_mode: "环路检测恢复模式",
    recover_manual: "手动恢复",
    recover_time: "自动恢复时间",
    detect_interval: "环路检测间隔",
    onu_status: "ONT状态",
    ld_port_id: "回环端口",
    ld_onu_id: "回环ONT",
    loop_detect: "环路检测",
    pon_loop_detect: "PON环路检测",
    ge_loop_detect: "上联口环路检测",
    ld_info: "环路检测信息",
    loopback: "回环",
    port_status: "端口状态",
    port_isolation: "端口隔离",
    pon_isolation_tips: "仅设置PON端口隔离",

    link_aggregation: "链路聚合",
    psc: "负载均衡选路算法",
    member_portlist: "汇聚组成员",
    link_aggregation_tips: "配置后该汇聚组端口成员将同时生效",
    trunk_id: "汇聚组号",

    wan_connect: "WAN连接",
    index: "索引",
    ipmode: "连接模式",
    ctype: "连接类型",
    igmpproxy: "IGMP代理",
    ipproto: "IP协议",
    pppoemode: "身份验证方法",
    tagmode: "绑定VLAN",
    reqdns: "手动配置DNS",
    pridns: "首选DNS服务器",
    secdns: "备用DNS服务器",
    portmap: "绑定端口",
    not_concerned: "不关注",
    gateway: "网关",
    distance: "距离(米)",
    last_down_time: "最后掉线时间",
    last_down_reason: "掉线原因",

    optical_module: "光模块信息",
    portstate: "端口状态",
    mstate: "模块状态",
    vendor_name: "厂商名称",
    vendor_oui: "厂商代码",
    vendor_rev: "厂商REV",
    vendor_pn: "厂商PN",
    vendor_sn: "厂商SN",
    date_code: "日期",
    vendor_specific: "厂商指定",
    module_type: "模块类型",
    max_distance: "最大距离",
    wave_length: "波长",
    fiber_type: "光纤类型",
    identifier: "封装形式",
    connector: "连接器",
    encoding: "编码",
    cc_base: "CC Base",

    temp_warn_threshold: "温度警告阈值(c))",
    temp_alarm_threshold: "温度报警阈值(c)",
    vol_warn_threshold: "电压警告阈值(c)",
    vol_alarm_threshold: "电压警报阈值(c)",
    tx_bias_warn_threshold: "发射偏差警告阈值(c)",
    tx_bias_alarm_threshold: "发射偏差警报阈值(c)",
    tx_power_warn_threshold: "发射功率警告阈值(c)",
    tx_power_alarm_threshold: "发射功率警报阈值(c)",
    rx_power_warn_threshold: "接收功率警告阈值(c)",
    rx_power_alarm_threshold: "接收功率警报阈值(c)",

    o_m_state: "光模块状态",
    o_m_static_info: "光模块静态信息",
    o_m_maunu_info: "光模块制造商信息",
    o_m_threshold: "光模块阈值参数",
    detected: "在位",
    undetected: "不在位",

    conn_error: "网络错误,请检查网络连接。",
    logins: "已登录次数",

    rx_octets: "接收字节数",
    // rx_frame: "接收帧数",
    rx_discard_frame: "接收丢弃帧",
    rx_error_frame: "接收错误帧",
    tx_octets: "发送字节数",
    // tx_frame: "发送帧数",
    tx_discard_frame: "发送丢弃帧",
    tx_error_frame: "发送错误帧",

    clear: "清除",
    mtype: "校准",
    ex_cali: "外部校准",
    in_cali: "内部校准",

    onu_wlan: "WLAN",
    encrypt: "加密方式",
    clear_wlan_tips: "注：清除WLAN连接，只会清除在当前设备上的配置的WLAN连接",
    batch_config: "批量配置",
    op_vlan: "ONT端口VLAN",
    wan_count: "已配置",
    wan_count_max: "最大支持数量",
    dhcp: "DHCP",
    dhcp_admin: "DHCP状态",
    relay_admin: "Relay状态",
    relay_policy: "Relay策略",
    standard: "标准(基于VLANIF)",
    option60: "Option60",
    option82_admin: "Option82状态",
    option82_policy: "Option82策略",
    reserve: "保留",
    drop: "剥除",
    replace: "替换",
    option82_circuit: "Sub-Option 1(代理电路ID)",
    option82_remote: "Sub-Option 2(代理远程ID)",
    snooping_admin: "Snooping状态",
    chaddr_check: "客户端地址检查",
    response_time: "等待响应时间",
    trust_portlist: "信任端口",
    server_ip: "服务器地址",
    lease_time: "租约时间(秒)",
    entry_status: "状态",
    snooping_table: "Snooping表项",
    dhcp_relay_tips: "DHCP Relay 需要三层支持，是否开启？",
    route_close_tips: "DHCP Relay 需要三层支持，是否关闭DHCP Relay ?",
    rogue_onu_detection: "流氓ONT检测",
    detection: "检测",
    rogueonu_detect_tips: "开始手动检测，检测结果将返回至告警列表中。",
    topo: "TOPO图",
    no_result: "无结果",
    refreshOrReset: "刷新/复位",
    saveAsImage: "保存为图片",
    p2p_flag: "P2P状态",
    rogue_mode: "流氓ONT检测",
    click_enter: "点击进入",
    more_features: "更多功能",
    auth: "认证",
    unAuth: "解除认证",
    confirm_download_file: "是否确认下载此文件?",
    port: "端口",
    pon_isolate_portlist: "PON隔离端口成员",
    uplink_isolate_portlist: "上联隔离端口成员",
    uplink: "上联",
    sn: "SN",
    no_allow_special: "不允许输入特殊字符",
    profname: "模板名",
    profid: "模板ID",
    mappingmode: "映射模式",
    tcont: "T-CONT",
    tcid: "T-CONT ID",
    dba_profid: "带宽模板ID",
    dba_profname: "带宽模板名称",
    gem: "GEM",
    gemindex: "GEM端口ID",
    tcontid: "T-CONT ID",
    mapping: "映射规则",
    ont_ethport: "以太网端口",
    ont_potsport: "FXS端口",
    ont_catvport: "CATV端口",
    template_mgmt: "模板管理",
    dba_profile: "DBA模板",
    line_profile: "线路模板",
    srv_profile: "业务模板",
    mappingmode: "映射模式",
    tcont: "T-CONT",
    tcont_delete: "该T-CONT下有绑定Gemport，不能被删除",
    tcid: "T-CONT ID",
    dba_profid: "带宽模板ID",
    dba_profname: "带宽模板名称",
    bindtimes: "绑定次数",
    pagination_display: "分页显示",
    native_vlan_flag: "Native Flag",
    portvlan: "端口VLAN",
    uniport: "UNI端口",
    unitype: "UNI端口类型",
    svlanid: "S-VLAN ID",
    svlanpri: "S-VLAN优先级",
    cvlanid: "C-VLAN ID",
    cvlanpri: "C-VLAN优先级",
    need: "需要",
    not_need: "不需要",
    veip_port: "Veip端口",
    auto_assign: "自动分配",
    hidden: "隐藏",
    is_exists: "已存在",
    no_dba_prf: "无DBA模板信息，请先添加。",
    no_tcont_info: "无TCONT信息，请先添加",
    untag_tips: "untag模式下无需重复添加",
    duplicate_param: "重复的参数",
    svlan: "S-VLAN ID",
    tag_action: "VLAN切换模式",
    svp_id: "虚端口ID",
    ont_id: "ONT ID",
    user_vlan: "C-VLAN",
    inner_vlan: "Inner VLAN",
    gemport: "GEM端口",
    list: "列表",
    virtual_port: "虚端口",
    disable_all: "禁用全部",
    enable_all: "启用全部",
    flush_all: "清除全部统计信息",
    statistical: "统计信息",
    all: "所有",

    loid: "LOID",
    loid_password: "LOID 密码",
    ont_lineprofid: "线路模板",
    ont_srvprofid: "业务模板",
    ont_sn: "序列号",
    ont_password: "密码",
    autofind_time: "自动发现时间",
    ont_name: "名称",
    state: "状态",
    rstate: "运行状态",
    cstate: "配置状态",
    mstate: "匹配状态",
    last_d_cause: "掉线原因",
    last_d_time: "掉线时间",
    last_u_time: "上线时间",
    ig_packets: "入口数据包",
    ig_bytes: "入口字节数",
    eg_packets: "出口数据包",
    eg_bytes: "出口字节数",
    stat_admin: "统计开关",
    auth_list: "认证列表",
    auto_discover_list: "自动发现列表",
    auto_config_temp: "自动配置模板",
    add_to_auth_list: "添加到认证列表",
    traffic_prof: "流量模板",
    traffic_profile_id: "流量模板ID",
    vendorid: "厂商",
    ont_version: "ONT版本",
    equipmentid: "设备ID",
    omcc_version: "OMCC版本",
    product_code: "产品代码",
    mainversion: "主分区版本号",
    stbversion: "备份分区版本号",
    ani_num: "PON端口数",
    eth_uni: "以太网端口数",
    pots_uni: "语音端口数",
    gem_num: "GEM端口数",
    tcont_num: "T-Cont数量",
    iphost_num: "IP配置",
    ethport_id: "端口号",
    porttype: "端口类型",
    epspeed: "端口速率(Mbps)", // 2
    epduplex: "端口双工", // 2
    epstatus: "端口状态", // 2
    ring: "环路状态",
    uniport: "端口号", // 2
    unitype: "端口类型", // 2
    na_vlan_id: "缺省VLAN",
    na_vlan_pri: "缺省VLAN优先级",
    ont_description: "ONT描述信息",
    last_dg_time: "上次掉电时间",
    lineprof_id: "线路模板ID",
    lineprof_name: "线路模板Name",
    srvprof_id: "业务模板ID",
    srvprof_name: "业务模板Name",
    uptime: "在线时间",
    version: "版本",
    switch: "切换",
    ont: "ONT",
    onu_port_info: "ONT端口信息",
    adminstate: "端口管理状态",
    epautoneg: "端口自适应",
    veip_num: "VeIP",
    support: "支持",
    not_support: "不支持",
    autofind: "自动发现",
    af_aging_time: "自动发现列表老化时间",
    af_interval: "自动发现间隔",
    laser: "端口光状态",
    fanid: "风扇",
    fan_speed: " 风扇转速",
    ipaddress_s: "起始IP地址",
    ipaddress_e: "结束IP地址",
    server_admin: "Server状态",

    mstp_status: "MSTP状态",
    mstp_region: "MST域",
    regional_name: "域名",
    revision_level: "修订版本",
    format_selector: "格式选择器",
    conf_digest: "配置摘要",
    bridge_max_age: "最大老化时间",
    bridge_hello_time: "Hello时间",
    max_hops: "最大跳数",
    bridge_forward_delay: "转发时延",
    bridge_addr: "本桥MAC",
    bridge_prio: "本桥优先级",
    designate_addr: "总根桥MAC",
    designate_prio: "总根桥优先级",
    regional_addr: "域根桥MAC",
    regional_prio: "域根桥优先级",
    root_port_name: "根端口",
    internal_path_cost: "域根端口开销",
    root_path_cost: "总根端口开销",
    root_max_age: "最大老化时间",
    root_hello_time: "Hello时间",
    root_forward_delay: "转发时延",
    bpdu_guard_port: "端口BPDU保护",
    edge_port: "边缘端口",
    port_name: "端口",
    port_priority: "端口优先级",
    mcheck: "端口状态迁移",
    loop_detect_guard: "端口环路保护",
    msti_vlanlist: "VLAN映射表",
    mstp: "MSTP",
    cist: "CIST",
    instance: "实例",
    msti: "MSTI",

    admin_external_cost: "配置开销",
    external_cost: "运行开销",
    admin_internal_cost: "配置开销",
    internal_cost: "运行开销",
    admin_edge_port: "配置Edge",
    auto_edge_port: "运行Edge",
    admin_p2p: "配置P2P",
    oper_p2p: "运行P2P",
    bpdu_guard: "BPDU保护",
    reset: "重置",
    bridge_time: " 本桥时间",
    root_time: "根桥时间",
    primary: "主DNS",
    secondary: "备用DNS",
    true: "True",
    false: "False",
    svp_af_id: "虚端口自动发现ID",
    untag: "Untag",
    svp_type: "VLAN类型",
    install_mode: "安装模式",
    manual: "手动",
    new_svlan: "S-VLAN",
    port_desc: "端口描述",
    show_binding: "查看绑定",
    shortcut: "快捷访问",
    open_rt_alarm: "打开实时告警",
    close_rt_alarm: "关闭实时告警",
    panel_temp: "面板温度",
    right_temp: "主芯片温度",
    binding_temp: "已绑定线路模板",
    log: "日志",
    module_name: "模块名称",
    level: "级别",
    rx_packets: "接收报文数",
    rx_bytes: "接收字节数",
    tx_packets: "发送报文数",
    tx_bytes: "发送字节数",
    gem_rx_packets: "接收报文数",
    gem_rx_bytes: "接收字节数",
    gem_tx_packets: "发送报文数",
    gem_tx_bytes: "发送字节数",
    gem_encrypt_key_error: "加密的key错误包数",
    tx_frame: "发送帧计数",
    tx_buffer_overflows: "发送缓存溢出次数计数",
    tx_single_collision_frame: "单次碰撞延迟发送帧计数",
    tx_multiple_collision_frame: "多次碰撞延迟发送帧计数",
    tx_excessive_collision_frame: "过多碰撞发送失败帧计数",
    tx_late_collision_frame: "发送发生延时冲突计数",
    sqe_test_error_message: "SQE(同步队列元素)测试错误消息计数",
    tx_delay_frame: "发送延迟帧计数",
    tx_mac_sub_layer_error_frame: "MAC子层发送错误帧计数",
    carrier_sense_error_frame: "载波监听丢失错误帧计数",
    tx_mtu_exceeded_discard_frame: "发送超MTU帧丢弃计数",
    rx_frame: "接收帧计数",
    rx_packet: "接收单播帧计数",
    rx_broadcast_packet: "接收广播帧计数",
    rx_multicast_packet: "接收多播帧计数",
    rx_octet: "接收正确帧字节计数",
    discard_frames_due_to_error: "接收错误帧字节计数",
    rx_undersize_packet: "收并丢弃的超短帧计数",
    rx_oversize_packet: "收并丢弃的超长帧计数",
    rx_fragment: "收碎片帧计数",
    rx_jabber: "接收Jabber错帧计数",
    rx_packets_64_octet: "接收64字节帧计数",
    rx_packets_65_127_octet: "接收65～127字节帧计数",
    rx_packets_128_255_octet: "接收128～255字节帧计数",
    rx_packets_256_511_octet: "收256～511字节帧计数",
    rx_packets_512_1023_octet: "接收512～1023字节帧计数",
    rx_packets_1024_1518_octet: "接收1024～1518字节帧计数",
    pppoe_filtered_frame: "PPPOE帧过滤计数",
    rx_fcs_error_frame: "接收FCS校验错帧计数",
    rx_buffer_overflows: "接收缓存溢出次数计数",
    rx_alignment_error_frame: "接收未对齐帧计数",
    rx_mac_sub_layer_error_frame: "MAC子层接收错误帧计数",
    olt_gem_statistics: "OLT侧GEM端口统计信息",
    ont_gem_statistics: "ONT侧GEM端口统计信息",
    ont_eth_statistics: "ONT以太网端口统计信息",
    port_default_vlan: "端口缺省VLAN",
    clear_perf_all: "清除所有统计信息",
    supplier_info: "供应商信息",
    mid: "映射号",
    port_group_mode: "端口组模式",
    inter_working: "互通模式",
    isolation: "隔离模式",
    ingress: "入口",
    egress: "出口",
    port_group: "端口组",
    port_maps: "端口映射表",
    save_all_changes: "保存所有修改",
    uniport_vlan_limit: "每个UNI端口最多可以分配8条规则",
    unsave_info: "当前页面存在未保存的信息，是否保存 ?",
    sys_port: "系统端口",
    batch_add_to_authlist_tips:
        "批量添加仅适用于SN认证的ONT，LOID注册的请单独添加。",
    trx_type: "PON模块",
    least_tcont_tips: "最少需要有一条TCONT",
    least_gem_tips: "最少需要有一条GEM Port",
    display_type: "显示类型",
    upgrade_tips: "设备正在升级中，请耐心等待，不要刷新网页或重启设备。",
    restore_defaults: "恢复默认值",
    invalid_ip: "非法IP地址或域名",
    qos_weight_tips: "权重相加的值必须为100或零。",
    us_ber: "上行SD Ber",
    ds_ber: "下行SD Ber",
    olt_rxpower: "OLT接收ONT功率",
    anti_mask: "反掩码",
    verification_code: "验证码",
    port_optical: "端口光诊断",
    ont_ipconfig: "ONT IP配置 ",
    ipoption: "IP类型",
    ipconfig_tips: "只允许配置两条，请在已有项上进行修改",
    fan_mgmt: "风扇管理",
    temperature: "当前温度",
    fullspeed: "全速",
    fan_info: "风扇信息",
    temp1: "温度点1",
    temp2: "温度点2",
    speed1: "超过温度点1时风扇转速",
    speed2: "超过温度点2时风扇转速",
    reason: "原因",
    trycount: "尝试注册次数",
    igmp_version: "IGMP版本",
    igmp_upstream: "上行IGMP VLAN模式",
    igmp_up_vid: "上行IGMP VLAN ID",
    igmp_up_pri: "上行IGMP VLAN 优先级",
    mcast_downstream: "下行IGMP和组播流VLAN模式",
    mcast_down_vid: "下行组播VLAN ID",
    mcast_down_pri: "下行组播VLAN优先级",
    def_route_v6: "IPv6缺省路由",
    primary_v6: "IPv6主DNS",
    secondary_v6: "IPv6备用DNS",
    ipv6: "IPv6",
    ipv4: "IPv4",
    telnet: " telnet ",
    telnet_status: "Telnet状态",
    afi: "IP协议",
    hostip: "IP地址",
    exact: "精确匹配",
    access: "访问方式",
    sys_acl: "系统访问控制",
    deny: "阻止",
    permit: "允许",
    dev_name: "设备名称",
    set_dev_name: "配置设备名称",
    syslog_server: "System Log",
    dhcp_v6: "DHCPv6",
    dhcpv6_admin: "DHCPv6状态",
    option18_admin: "Option18状态",
    option37_admin: "Option37状态",
};

export default zh;
