// pages/file-manage/file-manage.ts
import Dialog from "@vant/weapp/dialog/dialog";

import * as fileApi from "../../api/file";
import * as selfUtils from "./file-manage.utils";
import * as fileTypes from "../../types/file";
import config from "../../config/config";

const { envVersion } = wx.getAccountInfoSync().miniProgram;

Page({
  dirTree: [] as fileTypes.FileTree[], // 目录树结构
  /**
   * 页面的初始数据
   */
  data: {
    dirStack: [] as fileTypes.FileTree[], // 目录栈，目录的下钻、展示与返回都需要用到该栈
    addDirName: "", // 添加目录用户填写的名称

    currDirFiles: [] as fileTypes.File[], // 当前目录文件
    currDirFilesLoading: false, // 暂时没用，接口返回太快了，loading一闪而过很难受
    isUploadFile: false, // 是否在上传文件
    uploadFileProgress: 0, // 上传文件进度

    selectFile: {} as fileTypes.File | {}, // 当前选中文件，通过长按选中
    optionFileActions: [
      {
        name: "删除",
        color: "#db3231",
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getFileTree();
  },

  // 获取文件结构
  async getFileTree() {
    const res = await fileApi.getFileTree();
    this.dirTree = res.data.structure;
    const dirStack = this.data.dirStack;
    // 根据当前目录栈分两种情况更新数据
    if (dirStack.length > 1) {
      // 非根目录
      const dir = selfUtils.fildFillTreeData(
        res.data.structure,
        dirStack[dirStack.length - 1].id
      );
      if (dir) {
        this.setData({
          dirStack: dirStack.slice(0, dirStack.length - 1).concat([dir]),
        });
      }
    } else {
      // 根目录
      this.setData({
        dirStack: [
          {
            name: "根目录",
            id: "0",
            children: res.data.structure,
          },
        ],
      });
    }
  },

  // 获取文件列表
  async getFile(form: { structureId?: string; name?: string } = {}) {
    const res = await fileApi.getFiles(form);

    // 这里因为服务端暂时不用oss而使用了本地路径，这里将路径增加代理
    let host = envVersion === "develop" ? config.requestProxy : "";
    this.setData({
      currDirFiles: res.data.map((d) => ({
        ...d,
        content: `${host}${d.content}`,
      })),
      currDirFilesLoading: false,
    });
  },

  // 下钻目录
  onDrillDownDir(e: WechatMiniprogram.BaseEvent) {
    const dirId = e.currentTarget.dataset.id;
    const dir = selfUtils.fildFillTreeData(this.dirTree, dirId);
    if (!dir) return;

    this.setData({
      dirStack: this.data.dirStack.concat(dir),
      currDirFilesLoading: true,
    });

    this.getFile({ structureId: dir.id });
  },

  // 返回目录
  onBackDir() {
    const dirStack = this.data.dirStack;
    if (dirStack.length <= 1) return;

    const backedStack = dirStack.slice(0, dirStack.length - 1);
    this.setData({
      dirStack: backedStack,
      currDirFilesLoading: true,
    });

    this.getFile({ structureId: backedStack[backedStack.length - 1].id });
  },

  // 添加目录
  async onAddDir() {
    const dirStack = this.data.dirStack;
    const addDirName = this.data.addDirName;

    // 构建新的目录树
    let newTree = [];
    if (dirStack.length <= 1) {
      // 如果是根目录，直接在目录树结构前面添加一项
      newTree = ([] as fileTypes.FileTree[]).concat(
        [
          {
            name: addDirName,
            id: Date.now().toString(),
            children: [],
          },
        ],
        this.dirTree
      );
    } else {
      // 如果不是根目录则需要找到对应的children，向其添加
      newTree = selfUtils.updateFillTreeData(
        this.dirTree,
        dirStack[dirStack.length - 1].id,
        (dir) => {
          const children = dir.children || [];

          children.unshift({
            name: addDirName,
            id: Date.now().toString(),
            children: [],
          });

          return {
            children,
          };
        }
      );
    }

    // 提交目录树修改以及重新获取目录树
    await fileApi.setFileTree({ structure: newTree });
    await this.getFileTree();
    this.setData({
      addDirName: "",
    });
  },

  // 删除目录
  async onRemoveDir() {
    const dirStack = this.data.dirStack;

    // 如果有子目录需要二次确认
    if (
      dirStack[dirStack.length - 1].children?.length ||
      this.data.currDirFiles.length
    ) {
      await Dialog.confirm({
        title: "确定删除当前目录？",
        message: "当前目录文件和子目录将一并删除！",
        selector: "#remove",
      });
    }

    const newTree = selfUtils.updateFillTreeData(
      this.dirTree,
      dirStack[dirStack.length - 1].id,
      () => null
    );
    await fileApi.setFileTree({ structure: newTree });
    this.onBackDir();
    await this.getFileTree();
  },

  // 上传文件
  async onUploadFile() {
    // 设备上获取图片
    const result = await wx.chooseMedia({
      mediaType: ["image"],
      sourceType: ["album", "camera"],
    });

    // 开始上传
    this.setData({
      isUploadFile: true,
      uploadFileProgress: 0,
    });
    const files = await fileApi.uploadFiles(result.tempFiles, (progress) => {
      this.setData({
        isUploadFile: progress !== 100,
        uploadFileProgress: progress,
      });
    });

    // 上传完成，添加文件
    const dirStack = this.data.dirStack;
    const currDirId = dirStack[dirStack.length - 1].id;
    await fileApi.addFiles({
      structureId: currDirId,
      files: files.map((file) => ({
        content: file.filepath,
        name: file.originalname,
      })),
    });

    // 添加完成，重新获取
    this.getFile({ structureId: currDirId });
  },

  // 长按文件，打开设置菜单
  onOpenOptionFileAction(e: WechatMiniprogram.BaseEvent) {
    this.setData({
      selectFile: e.currentTarget.dataset.item,
    });
  },

  // 操作文件
  onOptionFile(e: any) {
    const selectFile = this.data.selectFile as fileTypes.File;

    switch (e.detail.name) {
      case "删除":
        this.removeFile(selectFile);
        break;
      default:
        break;
    }

    this.onClearOptionFile();
  },

  // 取消操作文件
  onClearOptionFile() {
    this.setData({
      selectFile: {},
    });
  },

  // 删除文件
  async removeFile(file: fileTypes.File) {
    await Dialog.confirm({
      title: "确定删除文件？",
      selector: "#remove",
    });

    await fileApi.removeFiles(file.id);
    const dirStack = this.data.dirStack;
    const currDirId = dirStack[dirStack.length - 1].id;
    this.getFile({ structureId: currDirId });
  },
});
