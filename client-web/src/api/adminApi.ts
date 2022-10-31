import axios from "../axios";

import * as userTypes from "@/types/user";

// 登录
export function login(payload: {
  mobile: string;
  password: string;
}): Promise<userTypes.UserInfo> {
  return axios.post("/api/user/login", payload);
}

// 注册
export function register(payload: {
  nick_name?: string;
  mobile: string;
  password: string;
}) {
  return axios.post("/api/user", payload);
}

// 查看登录状态
export function whoAmI(): Promise<userTypes.UserInfo> {
  return axios.get("/api/user/who-am-i");
}
