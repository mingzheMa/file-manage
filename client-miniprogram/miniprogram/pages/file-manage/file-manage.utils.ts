import * as fileTypes from "../../types/file";

/**
 * @description: 修改树形结构节点属性
 * @param {fileTypes} tree 目录结构
 * @param {string} id 目录id
 * @param {function} callback 找到对应目录后需要做的处理，将返回值向当前目录覆盖
 * @return {*}
 */
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

/**
 * @description: 查找目录
 * @param {fileTypes} tree 目录结构
 * @param {string} id 需要查找的目录id
 * @return {*} 找到的目录
 */
export function fildFillTreeData(tree: fileTypes.FileTree[], id: string) {
  function recursionTree(
    tree: fileTypes.FileTree[]
  ): fileTypes.FileTree | null {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].id === id) {
        return tree[i];
      } else {
        return recursionTree(tree[i].children || []);
      }
    }

    return null;
  }

  return recursionTree(tree);
}
