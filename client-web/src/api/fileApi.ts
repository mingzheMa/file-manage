import axios from "../axios";

import * as fileTypes from "@/types/file";

// 获取文件结构
export function getFileTree(): Promise<fileTypes.FileTreeInfo> {
  return axios.get(`/api/file-structure`);
}

// 修改文件结构
export function setFileTree(payload: {
  structure: fileTypes.FileTree[];
}): Promise<null> {
  return axios.put("/api/file-structure", payload);
}
