import axios from "axios";

// request添加请求头
axios.interceptors.request.use(
    config => {
        const xtoken = sessionStorage.getItem("x-token");
        config.headers["X-Token"] = xtoken;
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// 全局错误处理
axios.interceptors.response.use(
    response => {
        return response;
    },
    err => {
        err.response
            ? console.log(`${err.response.status} ${err.response.statusText}`)
            : console.log("Unknow error");
        return Promise.reject(err);
    }
);

export default axios;
