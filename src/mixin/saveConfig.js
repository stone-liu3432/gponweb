export default {
    methods: {
        saveConfig() {
            this.$confirm(this.$lang("save_cfg_confirm") + " ?")
                .then(_ => {
                    this.$http
                        .get("/system_save")
                        .then(res => {
                            if (res.data.code === 1) {
                                this.$message.success(this.$lang("save_succ"));
                            } else {
                                this.$message.error(
                                    `(${res.data.code}) ${res.data.message}`
                                );
                            }
                        })
                        .catch(err => {});
                })
                .catch(_ => {});
        }
    }
};
