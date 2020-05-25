import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_acl?form=time_range&name=all", "get", () => {
    const absolute = () =>
        Array.from({ length: Random.range(0, 12) }).map(() => ({
            stime: Random.time(),
            sday: Random.date(),
            etime: Random.time(),
            eday: Random.date(),
        }));
    const relative = () =>
        Array.from({ length: Random.range(0, 32) }).map(() => ({
            stime: Random.time(),
            etime: Random.time(),
            day: Random.pick([
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
                "Daily",
                "Weekend",
                "Working-day",
            ]),
        }));
    const data = Array.from({ length: Random.range(0, 256) }).map(() => ({
        name: Random.word(3, 16),
        state: Random.pick(["Active", "Inactive"]),
        absolute: absolute(),
        relative: relative(),
    }));
    return {
        code: 1,
        message: "success",
        data,
    };
});

Mock.post("/switch_acl?form=time_range");

Mock.post("/switch_acl?form=time_range&type=absolute");

Mock.post("/switch_acl?form=time_range&type=relative");
