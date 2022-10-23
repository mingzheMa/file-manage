import React, { useEffect, useState } from "react";

import FullSpin from "@/components/FullSpin";

import Icon from "@/components/Icon";
import FilesList from "./components/FilesList";
import * as fileApi from "@/api/fileApi";
import * as selfUtils from "./index.utils";
import * as fileTypes from "@/types/file";

import style from "./index.module.less";

interface Props {
  fileStructure: fileTypes.FileTreeInfo;
  selectedDir: fileTypes.FileTree;
}

const Files: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<fileTypes.File[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getFiles({
        structureId: props.selectedDir.id,
      });
      setLoading(false);
    })();
  }, [props.selectedDir]);

  async function getFiles(form: { structureId?: string; name?: string }) {
    const res = await fileApi.getFiles(form);
    setFiles(res);
  }

  return (
    <FullSpin spinning={loading}>
      <div className={style["files"]}>
        <div className={style["files__header"]}>
          <div className={style["files__header-name"]}>
            {props.selectedDir.name}（共{files.length}个）
          </div>

          <div>
            <div
              className={style["files__header-btns__upload"]}
              onClick={() => selfUtils.upload(props.selectedDir, getFiles)}
            >
              <Icon href="#icon-upload" />
            </div>
          </div>
        </div>

        <div className={style["files__list"]}>
          <FilesList files={files} getFiles={getFiles} />
        </div>
      </div>
    </FullSpin>
  );
};

export default Files;
