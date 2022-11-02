import * as userApi from "../api/user";
import config from "../config/config";

async function check() {
  // 判断是否存在token
  const token = wx.getStorageSync("access_token");
  if (token) return Promise.resolve();

  // 判断页面是否需要登录状态
  const noCheck = config.loginPathWhiteList.includes(
    getCurrentPages()[0].route
  );
  
  if (noCheck) return Promise.resolve();

  const { code } = await wx.login();
  const res = await userApi.login({ code });

  if (res.data.wxLoginToken) {
    // 首次登录需要绑定系统账号
    wx.redirectTo({
      url: `/pages/bind-account/bind-account?wxLoginToken=${res.data.wxLoginToken}`,
    });
  } else {
    wx.setStorageSync("access_token", res.data.access_token);
    wx.setStorageSync("user_info", res.data);
    wx.reLaunch({
      url: `/${getCurrentPages()[0].route}`,
    });
  }
}

export default function () {
  const OldPage = Page;

  Page = (options) => {
    // 封装onshow生命周期，对登录状态进行校验
    const oldShow = options.onShow;
    options.onShow = async function (...props) {
      await check();

      oldShow?.apply(this, props);
    };

    return OldPage(options);
  };
}
