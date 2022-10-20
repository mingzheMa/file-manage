import React, { ComponentType, ReactElement } from "react";

import { Spin } from "antd";

import style from "./index.module.less";

interface Props {
  children: JSX.Element;
  spinning: boolean;
}

const FullSpin: React.FC<Props> = function (props) {
  return (
    <Spin
      spinning={props.spinning}
      wrapperClassName={style["full-spin"]}
      style={{ maxHeight: "none" }}
    >
      {props.children}
    </Spin>
  );
};

export default FullSpin;
