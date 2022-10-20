import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Menu as AntdMenu } from "antd";

import menuConfig from "./menu.config";

const Menu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AntdMenu
      items={menuConfig}
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[location.pathname]}
      onSelect={(config) => {
        const path = config.keyPath.join("/")
        navigate(path)
      }}
    />
  );
};

export default Menu;
