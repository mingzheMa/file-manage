import React, { useEffect, useState } from "react";

import { Button, Divider, Input, Modal } from "antd";
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

  // 添加根文件夹
  function addRootFile() {
    let value = "";

    Modal.confirm({
      icon: false,
      title: "添加文件夹",
      content: (
        <Input
          placeholder="请输入名称"
          onChange={(e) => (value = e.target.value)}
        />
      ),
      onOk() {
        const structure = fileStructure.structure.concat({
          name: value,
          id: Date.now().toString(),
          children: [],
        });

        return new Promise((res, rej) => {
          fileApi
            .setFileTree({ structure })
            .then(() => {
              getFileTree();
              res(null);
            })
            .catch(() => {
              rej();
            });
        });
      },
    });
  }

  return (
    // 这个file-manage是为了获取dom的时候保证在当前页面
    <div className={`${style["file-manage"]} file-manage`}>
      <div className={style["file-manage__tree"]}>
        <FullSpin spinning={treeLoading}>
          <div style={{ height: "100%" }}>
            {/* 添加按钮 */}
            <Button
              type="primary"
              block
              onClick={addRootFile}
              style={{ marginBottom: "4px" }}
            >
              添加文件夹
            </Button>

            {/* 文件树 */}
            <div className={style["file-manage__tree-container"]}>
              {fileStructure.structure.length ? (
                <FileTree
                  fileStructure={fileStructure.structure}
                  getFileTree={getFileTree}
                  setSelectedDir={setSelectedDir}
                />
              ) : (
                <div>暂无数据</div>
              )}
            </div>
          </div>
        </FullSpin>
      </div>

      <Divider type="vertical" style={{ height: "100%" }} />

      <div className={style["file-manage__files"]}>
        <Files fileStructure={fileStructure} selectedDir={selectedDir} />
      </div>
    </div>
  );
}
