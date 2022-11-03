import request from "../utils/request";
import uploadFile from "../utils/uploadFile";
import * as fileTypes from "../types/file";
import * as requistTypes from "../types/requist";
import runQueue from "../utils/runQueue";

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

// 上传文件
export function uploadFiles(
  files: WechatMiniprogram.MediaFile[],
  onProgressUpdate?: (progress: number) => void
): Promise<fileTypes.DisplayFile[]> {
  return new Promise((resolve, reject) => {
    // 收集接口返回数据
    const response: fileTypes.DisplayFile[] = [];

    // 处理上传文件列表的迭代器
    function iterator(
      item: WechatMiniprogram.MediaFile,
      index: number,
      next: () => void
    ) {
      const uploadTask = uploadFile({
        url: "/api/file/upload",
        filePath: item.tempFilePath,
        name: "file",
        success(res) {
          response.push(JSON.parse(res.data)[0]);
          next();
        },
        fail: reject,
      });

      // 监听上传进度
      uploadTask.onProgressUpdate((res) => {
        // 计算总进度并调用监听函数
        const countProgress =
          ((index * 100 + res.progress) / (files.length * 100)) * 100;
        onProgressUpdate && onProgressUpdate(countProgress);
      });
    }

    // 执行文件列表
    runQueue(files, iterator, () => resolve(response));
  });
}

// 添加文件
export function addFiles(payload: {
  structureId: string;
  files: { content: string; name: string }[];
}): requistTypes.promiseResponse<[fileTypes.DisplayFile[]]> {
  return request.post("/api/file", payload);
}

// 删除文件
export function removeFiles(
  fileId: number
): requistTypes.promiseResponse<null> {
  return request.delete(`/api/file/${fileId}`);
}
