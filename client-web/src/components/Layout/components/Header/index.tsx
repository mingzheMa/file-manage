import React from "react";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";

import { Avatar, Dropdown, Menu, MenuProps } from "antd";

import * as userTypes from "@/types/user";

import style from "./index.module.less";

const Sider: React.FC = () => {
  const userInfo = useLoaderData() as userTypes.UserInfo;
  const navigate = useNavigate();

  const userOptionsItems = [
    {
      label: "退出登录",
      key: "logout",
    },
  ];

  const clickDropdown: MenuProps["onClick"] = function (e) {
    switch (e.key) {
      case "logout":
        logout();
        break;

      default:
        break;
    }
  };

  const logout = function () {
    document.cookie = "token='';path='/'";
    navigate("/login");
  };

  return (
    <div className={style["header"]}>
      <Dropdown
        overlay={<Menu items={userOptionsItems} onClick={clickDropdown}></Menu>}
      >
        <div className={style["header__user"]}>
          <Avatar alt={userInfo.nick_name} size="small">
            {userInfo.nick_name}
          </Avatar>

          <div className={style["header__user-name"]}>{userInfo.nick_name}</div>
        </div>
      </Dropdown>
    </div>
  );
};

export default Sider;
