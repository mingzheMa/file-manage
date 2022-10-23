import type { AxiosRequestConfig } from "axios";

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

// 查找文件
export function getFiles(payload?: {
  structureId?: string;
  name?: string;
}): Promise<fileTypes.File[]> {
  return axios.get("/api/file", {
    params: payload,
  });
}

// 上传文件
export function uploadFiles(
  formData: FormData,
  config?: AxiosRequestConfig
): Promise<fileTypes.DisplayFile[]> {
  return axios.post("/api/file/upload", formData, config);
}

// 添加文件
export function addFiles(payload: {
  structureId: string;
  files: { content: string; name: string }[];
}): Promise<[fileTypes.DisplayFile[]]> {
  return axios.post("/api/file", payload);
}
