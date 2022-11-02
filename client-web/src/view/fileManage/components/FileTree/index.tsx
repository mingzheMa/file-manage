import React, { useEffect, useState } from "react";
import type { TreeProps } from "antd/es/tree";

import * as fileApi from "@/api/fileApi";
import * as fileTypes from "@/types/file";

import { Tree } from "antd";
import * as selfUtils from "./index.utils";

import style from "./index.module.less";

interface Props {
  fileStructure: fileTypes.FileTree[];
  setSelectedDir: React.Dispatch<React.SetStateAction<fileTypes.FileTree>>; // 记录当前选中
  getFileTree: () => void; // 获取文件树
}

const FileTree: React.FC<Props> = function (props) {
  // 文件树渲染数据
  const [tree, setTree] = useState<fileTypes.FileTree[]>([]);

  // 处理文件树数据
  useEffect(() => {
    const newTree = selfUtils.setFillTreeData(
      props.fileStructure,
      props.getFileTree
    );
    setTree(newTree);
  }, [props.fileStructure]);

  // 树状图元素拖动事件
  const onDrop: TreeProps["onDrop"] = async (info) => {
    const newTree = selfUtils.dropComputed(info, tree);
    await fileApi.setFileTree({
      structure: newTree,
    });
    setTree(newTree);
    props.getFileTree();
  };

  return (
    <Tree.DirectoryTree
      className={style["file-tree"]}
      // @ts-ignore
      treeData={tree}
      fieldNames={{
        key: "id",
      }}
      switcherIcon={<div />}
      draggable={{ icon: false }}
      onClick={(e, info) => {
        props.setSelectedDir({
          // @ts-ignore
          id: info.id,
          // @ts-ignore
          name: info.name,
          // @ts-ignore
          children: info.children,
          title: info.title,
        });
      }}
      onDrop={onDrop}
      onRightClick={(e) =>
        (e.event.nativeEvent.target as HTMLDivElement).click()
      }
    />
  );
};

export default FileTree;
