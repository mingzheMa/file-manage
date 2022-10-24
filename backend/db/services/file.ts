import { Op, WhereOptions } from "sequelize";
import File from "../modules/File";
import error from "../error";
import validate from "../validate";

interface FileForm {
  content: string;
  name: string;
}

interface UpdateFileForm {
  structureId?: string;
  name?: string;
}

interface FindFileForm {
  fileStructureId: number;
  structureId?: string;
  id?: number;
  name?: string;
}

const tableRules = {
  fileStructureId: {
    type: "number",
  },
  structureId: {
    type: "string",
  },
  content: {
    type: "string",
    presence: {
      allowEmpty: false,
    },
  },
  name: {
    type: "string",
    presence: {
      allowEmpty: false,
    },
  },
};

export const create = async function (
  fileStructureId: number,
  structureId: string,
  files: FileForm[]
) {
  const form = {
    fileStructureId,
    structureId,
    files,
  };

  await validate.async(
    form,
    {
      fileStructureId: tableRules.fileStructureId,
      structureId: tableRules.structureId,
      files: {
        type: "array",
        presence: {
          allowEmpty: false,
        },
      },
    },
    // @ts-ignore
    { format: "flat" }
  );

  const hasFileName = await File.findOne({
    where: {
      name: files.map((file) => file.name),
      structureId,
    },
  });

  if (hasFileName) {
    return Promise.reject(error[3001]);
  } else {
    const res = await File.bulkCreate(
      files.map((file) => ({
        fileStructureId,
        structureId,
        ...file,
      }))
    );
    return res.map((i) => i.toJSON());
  }
};

export const remove = async function (fileId: number) {
  return await File.destroy({
    where: {
      id: fileId,
    },
  });
};

export const update = async function (fileId: number, obj: UpdateFileForm) {
  await validate.async(
    obj,
    {
      fileStructureId: tableRules.fileStructureId,
      structureId: tableRules.structureId,
      content: {
        type: "string",
      },
      name: {
        type: "string",
      },
    },
    // @ts-ignore
    { format: "flat" }
  );

  // 确认存在该文件
  const hasFile = await File.findByPk(fileId);
  if (!hasFile) {
    return Promise.reject(error[3002]);
  }

  // 确认修改后没有重名
  const hasFileName = await File.findOne({
    where: {
      name: obj.name || hasFile.name,
      structureId: obj.structureId || hasFile.structureId,
    },
  });
  if (hasFileName) {
    return Promise.reject(error[3001]);
  }

  // 更改文件
  return await File.update(
    {
      name: obj.name,
      structureId: obj.structureId,
    },
    {
      where: {
        id: fileId,
      },
      limit: 1,
    }
  );
};

export const find = async function (fildForm: FindFileForm, limit?: number) {
  await validate.async(
    fildForm,
    {
      fileStructureId: tableRules.fileStructureId,
    },
    // @ts-ignore
    { format: "flat" }
  );

  const where = fildForm as WhereOptions<File>;

  // 如果搜索条件加了name，则根据name模糊查找
  if (where["name"]) {
    where["name"] = {
      [Op.like]: `%${where["name"]}%`,
    };
  }

  const files = await File.findAll({
    where,
    limit,
  });

  return files.map((file) => file.toJSON());
};
