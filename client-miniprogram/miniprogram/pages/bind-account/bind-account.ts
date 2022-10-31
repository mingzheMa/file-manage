// pages/bind-account/bind-account.ts
import Toast from "@vant/weapp/toast/toast";

import * as userApi from "../../api/user";

let wxLoginToken = ""; // 绑定账号token

Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobale: "", // 电话
    password: "", // 密码
    commitLoading: false, // 提交loading
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wxLoginToken = options.wxLoginToken || "";
  },

  // 绑定用户
  async onBindUser() {
    this.setData({
      commitLoading: true,
    });
    try {
      const res = await userApi.bind({
        mobile: this.data.mobale,
        password: this.data.password,
        wxLoginToken,
      });

      if (res.statusCode !== 200) {
        if (res.data instanceof Array) {
          Toast.fail(res.data.join());
        } else {
          Toast.fail(res.data);
        }
        return;
      }

      wx.setStorageSync("access_token", res.data.access_token);
      wx.setStorageSync("user_info", res.data);
      wx.redirectTo({
        url: "/pages/index/index",
      });
    } finally {
      this.setData({
        commitLoading: false,
      });
    }
  },
});
