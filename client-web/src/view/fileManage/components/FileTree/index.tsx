import React, { useEffect, useState } from "react";
import type { TreeProps } from "antd/es/tree";

import * as fileApi from "@/api/fileApi";
import * as fileTypes from "@/types/file";

import { Tree } from "antd";
import FullSpin from "@/components/FullSpin";
import * as selfUtils from "./index.utils";

import style from "./index.module.less";

const FileTree: React.FC = function () {
  const [loading, setLoading] = useState<boolean>(false);
  const [tree, setTree] = useState<fileTypes.FileTree[]>([]);

  // 初始化
  useEffect(() => {
    (async () => {
      setLoading(true);
      await getFileTree();
      setLoading(false);
    })();
  }, []);

  // 获取文件树
  async function getFileTree() {
    const res = await fileApi.getFileTree();
    setTree(selfUtils.setFillTreeData(res.structure, getFileTree));
  }

  // 树状图元素拖动事件
  const onDrop: TreeProps["onDrop"] = async (info) => {
    const newTree = selfUtils.dropComputed(info, tree);
    await fileApi.setFileTree({
      structure: newTree,
    });
    setTree(newTree);
  };

  return (
    <FullSpin spinning={loading}>
      <Tree.DirectoryTree
        className={style["file-tree"]}
        // @ts-ignore
        treeData={tree}
        fieldNames={{
          key: "id",
        }}
        switcherIcon={<div />}
        draggable={{ icon: false }}
        onClick={(...e) => console.log("onClick", e)}
        onDrop={onDrop}
        onRightClick={(e) =>
          (e.event.nativeEvent.target as HTMLDivElement).click()
        }
      />
    </FullSpin>
  );
};

export default FileTree;
