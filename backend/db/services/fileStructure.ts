import FileStructure from "../modules/FileStructure";
import error from "../error";
import fileStructureCheck from "./utils/fileStructureCheck";
import { WhereOptions } from "sequelize";

interface Structure {
  name: string;
  id: string;
  children?: Structure[];
}

interface FileStructureForm {
  structure: Structure[];
}

export const create = async function (
  userId: number,
  obj: FileStructureForm,
  payload?: any
) {
  const hasFileStructure = await FileStructure.findOne({
    where: {
      userId,
    },
  });

  if (hasFileStructure) {
    return Promise.reject(error[2001]);
  }

  // 检查文件结构是否合规
  await fileStructureCheck(obj.structure);
  return await FileStructure.create(
    {
      userId,
      structure: obj.structure,
    },
    {
      transaction: payload.transaction,
    }
  );
};

export const remove = async function (fileStructureId: number) {
  return await FileStructure.destroy({
    where: {
      id: fileStructureId,
    },
  });
};

export const update = async function (
  where: WhereOptions<FileStructure>,
  obj: FileStructureForm
) {
  const hasFileStructure = await FileStructure.findOne({
    where,
  });

  if (!hasFileStructure) {
    return Promise.reject(error[2002]);
  }

  // 检查文件结构是否合规
  await fileStructureCheck(obj.structure);
  return await FileStructure.update(obj, {
    where,
    limit: 1,
  });
};

export const find = async function (where: WhereOptions<FileStructure>) {
  const fileStructureInfo = await FileStructure.findOne({
    where,
  });

  if (fileStructureInfo) {
    return fileStructureInfo.toJSON();
  } else {
    return Promise.reject(error[2002]);
  }
};
