import config from "../config/config";

const { envVersion } = wx.getAccountInfoSync().miniProgram;

// 上传接口
export default function (
  options: WechatMiniprogram.UploadFileOption
): WechatMiniprogram.UploadTask {
  if (envVersion === "develop") {
    options.url = `${config.requestProxy}${options.url}`;
  }

  if (!options.header) {
    options.header = {};
  }
  options.header.Authorization = wx.getStorageSync("access_token");

  return wx.uploadFile(options);
}
