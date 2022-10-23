import React, { useEffect, useState } from "react";

import { Divider } from "antd";
import FileTree from "./components/FileTree";
import Files from "./components/Files";
import FullSpin from "@/components/FullSpin";

import * as fileApi from "@/api/fileApi";
import * as fileTypes from "@/types/file";

import style from "./index.module.less";

export default function index() {
  // 文件树
  const [treeLoading, setTreeLoading] = useState<boolean>(false);
  // 文件结构接口数据
  const [fileStructure, setFileStructure] = useState<fileTypes.FileTreeInfo>({
    id: 0,
    userId: 0,
    structure: [],
  });

  // 当前选中的目录
  const [selectedDir, setSelectedDir] = useState<fileTypes.FileTree>({
    name: "",
    id: "",
  });

  // 初始化
  useEffect(() => {
    (async () => {
      setTreeLoading(true);
      await getFileTree();
      setTreeLoading(false);
    })();
  }, []);

  // 获取文件树
  async function getFileTree() {
    const res = await fileApi.getFileTree();
    setFileStructure(res);
  }

  return (
    // 这个file-manage是为了获取dom的时候保证在当前页面
    <div className={`${style["file-manage"]} file-manage`}>
      <div className={style["file-manage__tree"]}>
        <FullSpin spinning={treeLoading}>
          <FileTree
            fileStructure={fileStructure.structure}
            getFileTree={getFileTree}
            setSelectedDir={setSelectedDir}
          />
        </FullSpin>
      </div>

      <Divider type="vertical" style={{ height: "100%" }} />

      <div className={style["file-manage__files"]}>
        <Files fileStructure={fileStructure} selectedDir={selectedDir} />
      </div>
    </div>
  );
}
