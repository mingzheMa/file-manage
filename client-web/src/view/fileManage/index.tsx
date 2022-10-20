import React from "react";

import { Divider } from "antd";
import FileTree from "./components/FileTree";

import style from "./index.module.less";

export default function index() {
  return (
    // 这个file-manage是为了获取dom的时候保证在当前页面
    <div className={`${style["file-manage"]} file-manage`}>
      <div className={style["file-manage__tree"]}>
        <FileTree />
      </div>

      <Divider type="vertical" style={{ height: "100%" }} />

      <div className={style["file-manage__files"]}>files</div>
    </div>
  );
}
