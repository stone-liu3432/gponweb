import Mock from "@/mock";

const { Random } = Mock;

Mock.mock("/switch_qos?form=qos", "get", () => {
    const prio = () => Random.range(0, 7);
    const weight = () => Random.range(0, 15);
    return {
        code: 1,
        message: "success",
        data: {
            cmode: Random.pick(["SPWRR", "WRR", "SP"]),
            queue: [
                { cos: 0, mode: "SP", weight: weight() },
                { cos: 1, mode: "SP", weight: weight() },
                { cos: 2, mode: "SP", weight: weight() },
                { cos: 3, mode: "SP", weight: weight() },
                { cos: 4, mode: "SP", weight: weight() },
                { cos: 5, mode: "SP", weight: weight() },
                { cos: 6, mode: "SP", weight: weight() },
                { cos: 7, mode: "SP", weight: weight() },
            ],
            cosq: [
                prio(),
                prio(),
                prio(),
                prio(),
                prio(),
                prio(),
                prio(),
                prio(),
            ],
        },
    };
});

Mock.post("/switch_qos?form=queue-scheduler");

Mock.post("/switch_qos?form=cosqmap");
