import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_dhcp?form=dhcpv6_global", "get", () => ({
    code: 1,
    message: "success",
    data: {
        dhcpv6_admin: Random.range(0, 1),
        option18_admin: Random.range(0, 1),
        option37_admin: Random.range(0, 1),
    },
}));

Mock.post("/switch_dhcp?form=dhcpv6_admin");

Mock.post("/switch_dhcp?form=option18_admin");

Mock.post("/switch_dhcp?form=option37_admin");
