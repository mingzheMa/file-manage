import checkLogin from "./encapsulation/checkLogin";

// 对Page二次封装，增加登录校验
checkLogin();

// app.ts
App<IAppOption>({
  globalData: {},
});
