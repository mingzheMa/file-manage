import config from "../config/config";

type method =
  | "OPTIONS"
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "TRACE"
  | "CONNECT";

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
    return new Promise((resove, reject) => {
      wx.request({
        url,
        data,
        method,
        success(res) {
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

export default methods.reduce((curr, next) => {
  curr[next.toLowerCase()] = getRequest(next);
  return curr;
}, {} as { [key: string]: (url: string, data?: {}, options?: { [key: string]: any }) => Promise<any> });
