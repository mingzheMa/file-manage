import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Layout as AntdLayout } from "antd";

import Sider from "./components/Sider";
import Header from "./components/Header";

import style from "./index.module.less";

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AntdLayout>
      <AntdLayout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Sider siderCollapsed={collapsed} />
      </AntdLayout.Sider>

      <AntdLayout>
        <AntdLayout.Header className={style.header}>
          <Header />
        </AntdLayout.Header>

        <AntdLayout.Content className={style.content}>
          <Outlet />
        </AntdLayout.Content>
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;
