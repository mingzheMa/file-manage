import type { MenuProps } from "antd";

import Icon from "@/components/Icon";

type MenuItem = Required<MenuProps>["items"][number];

export default [
  {
    label: "首页",
    key: "/",
    icon: <Icon href="#icon-shujuzhongxin" />,
  },
  {
    label: "文件管理",
    key: "/file-manage",
    icon: <Icon href="#icon-wenjianjia" />,
  },
] as MenuItem[];
