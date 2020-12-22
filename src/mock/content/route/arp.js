import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_route?form=arp_table", "get", "@BASESUCCESS");

Mock.mock("/arp_table", "get", () => {
    const data = Array.from({ length: Random.range(0, 4094) }).map(
        (item, index) => ({
            ipaddress: Random.ip(),
            macaddress: Random.mac(),
            portid: Random.range(17, 24),
            vlanid: index + 1,
        })
    );
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.post("/switch_route?form=arp_flush");
