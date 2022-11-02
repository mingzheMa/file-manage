import type { DataNode } from "antd/es/tree";
import * as fileTypes from "@/types/file";

import TreeDropdown from "./components/TreeDropdown";

// 格式化接口参数
export function setFillTreeData(
  tree: fileTypes.FileTree[],
  getFileTree: () => void
) {
  function setTreesetTree(
    tree: fileTypes.FileTree[],
    rootTree: fileTypes.FileTree[]
  ): fileTypes.FileTree[] {
    if (tree instanceof Array) {
      return tree.map((node) => ({
        ...node,
        title: (
          <TreeDropdown node={node} tree={rootTree} getFileTree={getFileTree}>
            <div>{node.name}</div>
          </TreeDropdown>
        ),
        children: setTreesetTree(node.children || [], rootTree),
      }));
    } else {
      return [];
    }
  }

  return setTreesetTree(tree, tree);
}

// 修改树形结构节点属性（返回新数据）
export function updateFillTreeData(
  tree: fileTypes.FileTree[],
  id: string,
  callback: (tree: fileTypes.FileTree) => { [key: string]: any } | null
) {
  function recursionTree(tree: fileTypes.FileTree[]): fileTypes.FileTree[] {
    const newTree: fileTypes.FileTree[] = [];

    tree.forEach((node) => {
      if (node.id === id) {
        // 如果callback返回null则视为删除这个节点
        const setData = callback(node);

        if (setData) {
          newTree.push({
            ...node,
            ...setData,
            children: recursionTree(node.children || []),
          });
        }
      } else {
        newTree.push({
          ...node,
          children: recursionTree(node.children || []),
        });
      }
    });

    return newTree;
  }

  return recursionTree(tree);
}

// 拖拽事件计算
export function dropComputed(info: any, tree: fileTypes.FileTree[]) {
  const dropKey = info.node.key;
  const dragKey = info.dragNode.key;
  const dropPos = info.node.pos.split("-");
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

  const loop = (
    data: any[],
    key: React.Key,
    callback: (node: DataNode, i: number, data: DataNode[]) => void
  ) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === key) {
        return callback(data[i], i, data);
      }
      if (data[i].children) {
        loop(data[i].children!, key, callback);
      }
    }
  };

  const data = [...tree];

  // Find dragObject
  let dragObj: DataNode;
  loop(data, dragKey, (item, index, arr) => {
    arr.splice(index, 1);
    dragObj = item;
  });

  if (!info.dropToGap) {
    // Drop on the content
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      // where to insert 示例添加到头部，可以是随意位置
      item.children.unshift(dragObj);
    });
  } else if (
    ((info.node as any).props.children || []).length > 0 && // Has children
    (info.node as any).props.expanded && // Is expanded
    dropPosition === 1 // On the bottom gap
  ) {
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      // where to insert 示例添加到头部，可以是随意位置
      item.children.unshift(dragObj);
      // in previous version, we use item.children.push(dragObj) to insert the
      // item to the tail of the children
    });
  } else {
    let ar: DataNode[] = [];
    let i: number;
    loop(data, dropKey, (_item, index, arr) => {
      ar = arr;
      i = index;
    });
    if (dropPosition === -1) {
      ar.splice(i!, 0, dragObj!);
    } else {
      ar.splice(i! + 1, 0, dragObj!);
    }
  }

  return data;
}
