import { notification, Progress } from "antd";

import * as fileApi from "@/api/fileApi";
import * as fileTypes from "@/types/file";

// 上传事件
export function upload(
  fileDir: fileTypes.FileTree,
  getFiles: (form: { structureId?: string; name?: string }) => void
) {
  // 创建input，利用input的上传功能获取文件
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.onchange = (e) => {
    uploading(e, fileDir, getFiles);
  };
  input.style.display = "none";
  document.body.appendChild(input);
  input.click();
}

// 上传中
async function uploading(
  e: Event,
  fileDir: fileTypes.FileTree,
  getFiles: (form: { structureId?: string; name?: string }) => void
) {
  // 获取待上传文件
  const target = e.target as HTMLInputElement;
  const files = target.files || [];

  // 这里获取文件后就可以删除上传input的dom了
  document.body.removeChild(target);

  // 接口上传
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("file", files[i]);
  }
  const key = Date.now().toString();
  // 上传文件信息
  const uploadedFiles = await fileApi
    .uploadFiles(formData, {
      onUploadProgress(e) {
        // 上传进度
        const progress = Math.round((e.loaded / e.total) * 100);
        notification.open({
          message: `正在上传${files?.length}个文件`,
          key,
          duration: 0,
          description: <Progress size="small" percent={progress} />,
        });

        if (progress === 100) {
          setTimeout(() => {
            notification.close(key);
          }, 3000);
        }
      },

      headers: {
        "Content-type": "charset=utf-8",
      },
    })
    .catch((err) => {
      notification.open({
        message: `${err.response.data}`,
        key,
        duration: 3000,
        description: <Progress size="small" percent={100} status="exception" />,
      });
      return Promise.reject(err);
    });

  addFiles(uploadedFiles, fileDir, getFiles);
}

// 保存上传文件
async function addFiles(
  files: fileTypes.DisplayFile[],
  fileDir: fileTypes.FileTree,
  getFiles: (form: { structureId?: string; name?: string }) => void
) {
  await fileApi.addFiles({
    structureId: fileDir.id,
    files: files.map((file) => ({
      name: file.originalname,
      content: file.filepath,
    })),
  });

  getFiles({
    structureId: fileDir.id,
  });
}
