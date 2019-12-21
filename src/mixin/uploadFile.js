"use strict";
export default {
    methods: {
        uploadFile(url, file) {
            let f = file;
            if (!file instanceof FormData) {
                f = new FormData();
                f.append("file", file);
            }
            return this.$http.post(url, f, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 0
            });
        }
    }
};
