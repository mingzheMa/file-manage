import React from "react";

import Menu from "./components/Menu";

import systemConfig from "@/config/system";

import style from "./index.module.less";

interface Props {
  siderCollapsed: boolean;
}

const Sider: React.FC<Props> = (props) => {
  function setLogo(siderCollapsed: boolean, logo: string) {
    return siderCollapsed ? logo[0] : logo;
  }

  return (
    <div className={style.sider}>
      <div className={style["sider-logo"]}>
        {setLogo(props.siderCollapsed, systemConfig.logo)}
      </div>

      <div className={style["sider-menu"]}>
        <Menu />
      </div>
    </div>
  );
};

export default Sider;
