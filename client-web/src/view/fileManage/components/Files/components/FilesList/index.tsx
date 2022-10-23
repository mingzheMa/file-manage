import React from "react";

import { Upload } from "antd";

import * as fileTypes from "@/types/file";

import style from "./index.module.less";

interface Props {
  files: fileTypes.File[];
  getFiles: (form: { structureId?: string; name?: string }) => void;
}

const FilesList: React.FC<Props> = (props) => {
  return (
    <div className={style["files-list"]}>
      {props.files.map(f => <div key={f.id}>{f.name}</div>)}
    </div>
  );
};

export default FilesList;
