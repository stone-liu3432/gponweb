export default {
    methods: {
        logout() {
            this.$confirm(this.$lang("logout") + " ?")
                .then(_ => {
                    const data = {
                        method: "set",
                        param: {
                            name: sessionStorage.getItem("uname")
                        }
                    };
                    this.$http
                        .post("/userlogin?form=logout", data)
                        .then(res => {
                            this.$message.success(this.$lang("login_out"));
                            sessionStorage.removeItem("x-token");
                            sessionStorage.removeItem("uname");
                            this.$router.push("/login");
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        }
    }
};
