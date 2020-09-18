import Mock from "@/mock";

const Random = Mock.Random;

Mock.mock("/system_service?form=frpc", "get", {
    code: 1,
    message: "success",
    data: {
        server_addr: "@IP",
        server_port: "@RANGE(1,65535)",
        token: Random.word(16),
        appname: Random.first(),
        type: "@STATUS",
        local_ip: "127.0.0.1",
        local_port: 80,
        remote_port: "@RANGE(1,65535)",
        custom_domains: "www.test.com",
        subdomain: "test",
    },
});

Mock.mock("/snmp_cfg?form=trap", "get", {
    code: 1,
    message: "success",
    data: {
        serverip: "@IP",
        trap_port: "@RANGE(1,65535)",
        trap_community: Random.first(),
    },
});

Mock.mock("/snmp_cfg?form=community", "get", {
    code: 1,
    message: "success",
    data: {
        read_community: Random.first(),
        write_community: Random.last(),
    },
});

Mock.mock("/system_service?form=sshd", "get", {
    code: 1,
    message: "success",
    data: [
        {
            keyname: Random.first(),
            publickey:
                "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDFkr4tNiHUKTlNNJuM7JeAXN5VibwxYUMtGwzYtZIDUnyYqak2Bj4ByIeNn+dLZVAQw7fYoLJzVpmaMhwcCtgXwhFy1DDzXD2UsU2GOtMSSQlXi1hV8Eukc6GDggc077LV8T3hPCWcddthVxywn0jp3VrXnI0KQ7ZkRDiwDj3TcSVvTjyFPnsLKm3gwWRrX7mHJjV53lZty1DIBJ74GwzvBgAJHfY6ly3vxKAmJ7uKALgugRyK12vYUon64G2XqEh1r8n5elmbu6jy1v6DsrNUF2ZB29MXA0pWWPuyRmcqy7PFtVHbbQK4hJlPGyUTcXdDPfCygxBleGo9root@localhost.localdomain",
        },
    ],
});

Mock.mock("/system_service?form=frpc", "post", "@BASESUCCESS");

Mock.mock("/snmp_cfg?form=community", "post", "@BASESUCCESS");

Mock.mock("/snmp_cfg?form=trap", "post", "@BASESUCCESS");

Mock.mock("/system_service?form=sshd", "post", "@BASESUCCESS");

Mock.mock("/system_service?form=port", "get", () => ({
    code: 1,
    message: "success",
    data: {
        http: Random.range(1, 65535),
        https: Random.range(1, 65535),
        telnet: Random.range(1, 65535),
    },
}));

Mock.post("/system_service?form=port");
