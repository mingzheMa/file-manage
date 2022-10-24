import React, { useEffect, useState } from "react";

import { Slider } from "antd";
import FullSpin from "@/components/FullSpin";

import Icon from "@/components/Icon";
import GridFileList from "./components/GridFileList";
import * as fileApi from "@/api/fileApi";
import * as selfUtils from "./index.utils";
import * as fileTypes from "@/types/file";

import style from "./index.module.less";

interface Props {
  fileStructure: fileTypes.FileTreeInfo;
  selectedDir: fileTypes.FileTree;
}

const Files: React.FC<Props> = (props) => {
  // 文件列表loading
  const [loading, setLoading] = useState(false);
  // 文件列表数据
  const [files, setFiles] = useState<fileTypes.File[]>([]);
  // 文件展示缩放系数（每个文件占父级的百分比），范围：0 - 1
  const [scaleFactor, setScaleFactor] = useState(0.3);

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
      {props.selectedDir.id ? <div className={style["files"]}>
        <div className={style["files__header"]}>
          <div className={style["files__header-name"]}>
            {props.selectedDir.name}（共{files.length}个）
          </div>

          <div className={style["files__header-utils"]}>
            {/* 调整缩放系数 */}
            <Slider
              defaultValue={scaleFactor * 100}
              max={100}
              min={10}
              tooltip={{ open: false }}
              onChange={(e) => setScaleFactor(e / 100)}
            />

            {/* 上传 */}
            <div
              className={style["files__header-utils__upload"]}
              onClick={() => selfUtils.upload(props.selectedDir, getFiles)}
            >
              <Icon href="#icon-upload" />
            </div>
          </div>
        </div>

        <div className={`${style["files__list"]} files__list`}>
          <GridFileList
            files={files}
            scaleFactor={scaleFactor}
            getFiles={() => getFiles({ structureId: props.selectedDir.id })}
          />
        </div>
      </div> : <div>请选择文件夹</div>}
    </FullSpin>
  );
};

export default Files;
