import { clearSessionStorage } from "@/utils/common";

export default {
    methods: {
        logout() {
            this.$confirm(this.$lang("logout") + " ?")
                .then(() => {
                    this.logoutAction();
                })
                .catch(() => {});
        },
        logoutAction() {
            const data = {
                method: "set",
                param: {
                    name: sessionStorage.getItem("uname"),
                },
            };
            this.$http
                .post("/userlogin?form=logout", data)
                .then((res) => {
                    this.$message.success(this.$lang("login_out"));
                    clearSessionStorage();
                    this.$router.push("/login");
                })
                .catch((err) => {});
        },
    },
};
