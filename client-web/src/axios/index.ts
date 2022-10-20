import axios from "axios";

import { message } from "antd";

const instance = axios.create();

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response.data.data || response.data;
  },
  (error) => {
    if (error.response && error.response.status) {
      switch (error.response.status) {
        // 处理登录过期
        case 401:
          error.message = "请登录";
          message.warning("登录已过期，请重新登录")
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
          break;

        // 处理无权限
        case 403:
          window.location.href = "/403";
          break;

        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default instance