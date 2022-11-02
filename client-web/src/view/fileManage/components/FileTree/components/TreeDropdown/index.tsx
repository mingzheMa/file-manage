import React from "react";
import type { MenuInfo } from "rc-menu/lib/interface";

import * as fileTypes from "@/types/file";
import * as selfUtils from "./index.utils";

import { Dropdown, Menu, Modal, Input } from "antd";

import style from "./index.module.less";

interface TreeDropdownMenuProps {
  node: fileTypes.FileTree;
  tree: fileTypes.FileTree[];
  getFileTree: () => void;
}

interface TreeDropdownProps extends TreeDropdownMenuProps {
  children: any;
}

// 下拉菜单中的菜单
const TreeDropdownMenu: React.FC<TreeDropdownMenuProps> = (props) => {
  const items = [
    { label: "添加", key: "add" },
    { label: "重命名", key: "rename" },
    { label: "删除", key: "delete" },
  ];

  const onClick = function (node: fileTypes.FileTree, e: MenuInfo) {
    const type2Func: any = {
      add: selfUtils.addTreeNode,
      rename: selfUtils.renameTreeNode,
      delete: selfUtils.removeTreeNode,
    };

    type2Func[e.key] && type2Func[e.key](node, props.tree, props.getFileTree);
  };

  return <Menu items={items} onClick={(e) => onClick(props.node, e)} />;
};

// 下拉菜单
const TreeDropdown: React.FC<TreeDropdownProps> = (props) => {
  return (
    <Dropdown
      overlay={
        <TreeDropdownMenu
          node={props.node}
          tree={props.tree}
          getFileTree={props.getFileTree}
        />
      }
      trigger={["contextMenu"]}
    >
      <div
        className={`${style["tree-title"]} tree-title`}
        data-id={props.node.id}
      >
        {props.children}
      </div>
    </Dropdown>
  );
};

export default TreeDropdown;
