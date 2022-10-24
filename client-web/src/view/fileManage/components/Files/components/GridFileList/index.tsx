import React, { useState } from "react";

import * as selfUtils from "./index.utils";
import * as fileTypes from "@/types/file";

import style from "./index.module.less";

interface Props {
  files: fileTypes.File[];
  scaleFactor: number;
  getFiles: () => void;
}

const GridFileList: React.FC<Props> = (props) => {
  // 选中文件列表，目前只支持选中一个
  const [selectedFiles, setSelectedFiles] = useState<fileTypes.File[]>([]);

  const VNodes = props.files.map((f) => {
    const isSelected = Boolean(
      selectedFiles.find((selectedFile) => selectedFile.id === f.id)
    );
    return selfUtils.getFileVNode(
      f,
      props.scaleFactor,
      isSelected,
      setSelectedFiles,
      props.getFiles
    );
  });

  return <div className={style["file-list"]}>{VNodes}</div>;
};

export default GridFileList;
