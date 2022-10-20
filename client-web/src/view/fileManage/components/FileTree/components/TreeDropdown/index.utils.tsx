import { Modal, Input } from "antd";

import * as fileManageUtils from "../../index.utils";
import * as fileApi from "@/api/fileApi";
import * as fileTypes from "@/types/file";

export const addTreeNode = function (
  node: fileTypes.FileTree,
  tree: fileTypes.FileTree[],
  getFileTree: () => void
) {
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
      const structure = fileManageUtils.updateFillTreeData(
        tree,
        node.id,
        () => {
          const children = node.children || [];

          children.unshift({
            name: value,
            id: Date.now().toString(),
            children: [],
          });

          return {
            ...node,
            children,
          };
        }
      );

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
};

export const removeTreeNode = async function (
  node: fileTypes.FileTree,
  tree: fileTypes.FileTree[],
  getFileTree: () => void
) {
  if (node.children?.length) {
    await new Promise((res) => {
      Modal.confirm({
        title: "删除文件夹",
        content: "该文件夹下有子文件，确认删除？",
        onOk() {
          res(null);
        },
      });
    });
  }

  const structure = fileManageUtils.updateFillTreeData(
    tree,
    node.id,
    () => null
  );

  await fileApi.setFileTree({ structure });
  getFileTree();
};

export const renameTreeNode = async function (
  node: fileTypes.FileTree,
  tree: fileTypes.FileTree[],
  getFileTree: () => void
) {
  let value = node.name;

  Modal.confirm({
    icon: false,
    title: "文件夹重命名",
    content: (
      <Input
        placeholder="请输入名称"
        defaultValue={value}
        onChange={(e) => (value = e.target.value)}
      />
    ),
    onOk() {
      const structure = fileManageUtils.updateFillTreeData(
        tree,
        node.id,
        () => {
          return {
            ...node,
            name: value,
          };
        }
      );

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
};
