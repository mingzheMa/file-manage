import request from "../utils/request";
import * as fileTypes from "../types/file";
import * as requistTypes from "../types/requist";

// 获取文件结构
export function getFileTree(): requistTypes.promiseResponse<fileTypes.FileTreeInfo> {
  return request.get("/api/file-structure");
}

// 修改文件结构
export function setFileTree(payload: {
  structure: fileTypes.FileTree[];
}): requistTypes.promiseResponse<null> {
  return request.put("/api/file-structure", payload);
}

// 查找文件
export function getFiles(payload?: {
  structureId?: string;
  name?: string;
}): requistTypes.promiseResponse<fileTypes.File[]> {
  return request.get("/api/file", payload);
}
