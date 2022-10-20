import { createBrowserRouter } from "react-router-dom";

import Layout from "../components/Layout/index";
import Login from "../view/login";
import Register from "../view/register";
import Index from "../view/index";
import FileManage from "../view/fileManage";

import * as adminApi from "@/api/adminApi";
import cookie from "cookie";

// 检查登录状态
async function checkLogin() {
  const userInfo = localStorage.getItem("userInfo");

  // 这里判断不仅需要自己存储的loaclStorage有值，还需要cookie有值
  if (userInfo && cookie.parse(document.cookie).token) {
    return Promise.resolve(JSON.parse(userInfo));
  } else {
    const info = await adminApi.whoAmI();
    localStorage.setItem("userInfo", JSON.stringify(info));
    return info;
  }
}

export default createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    async loader() {
      return await checkLogin();
    },
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "file-manage",
        element: <FileManage />,
        async loader() {
          return await checkLogin();
        },
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
