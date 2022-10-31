// pages/index/index.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    utilList: [
      {
        icon: "description",
        title: "文件管理",
        key: "file-manage",
      },
    ],
  },

  onClickUtil(e: WechatMiniprogram.BaseEvent) {
    switch (e.mark?.item.key) {
      case "file-manage":
        wx.navigateTo({
          url: "/pages/file-manage/file-manage",
        });
        break;

      default:
        break;
    }
  },
});
