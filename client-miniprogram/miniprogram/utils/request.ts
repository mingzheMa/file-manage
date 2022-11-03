import config from "../config/config";
import * as userApi from "../api/user";

// 基本接口
type method =
  | "OPTIONS"
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "TRACE"
  | "CONNECT";

type baseRequestFunc = (
  url: string,
  data?: {},
  options?: { [key: string]: any }
) => Promise<any>;

const methods: method[] = [
  "OPTIONS",
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "DELETE",
  "TRACE",
  "CONNECT",
];

const { envVersion } = wx.getAccountInfoSync().miniProgram;
function getRequest(method: method) {
  return function (
    url: string,
    data?: { [key: string]: any },
    options?: { [key: string]: any }
  ) {
    // 判断是否为开发环境请求本地接口，前提是微信配置不校验https协议
    if (envVersion === "develop") {
      url = `${config.requestProxy}${url}`;
    }
    // 增加请求头
    const header = {
      // 登录状态token
      Authorization: wx.getStorageSync("access_token"),
    };
    return new Promise((resove, reject) => {
      wx.request({
        url,
        data,
        method,
        header,
        async success(res) {
          if (res.statusCode === 401) {
            const { code } = await wx.login();
            const res = await userApi.login({ code });

            wx.setStorageSync("access_token", res.data.access_token);
            wx.setStorageSync("user_info", res.data);

            wx.reLaunch({
              url: `/${getCurrentPages()[0].route}`,
            });
          }

          resove(res);
        },
        fail(err) {
          reject(err);
        },
        ...options,
      });
    });
  };
}

const request = methods.reduce((curr, next) => {
  curr[next.toLowerCase()] = getRequest(next);
  return curr;
}, {} as { [key: string]: baseRequestFunc });

export default request;
