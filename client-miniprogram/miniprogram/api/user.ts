import request from "../utils/request";

// 登录
export function login(payload: { code: string }) {
  return request.post("/api/user/wx-login", payload);
}

// 绑定用户（需要手机号+密码，如果手机号已注册，验证密码是否正确并绑定。如果手机未注册，则注册用户并绑定）
export function bind(payload: {
  mobile: string;
  password: string;
  wxLoginToken: string;
}) {
  return request.post("/api/user/wx-bind-account", payload);
}
