import { Op, WhereOptions } from "sequelize";
import File from "../modules/File";
import error from "../error";
import validate from "../validate";

interface FileForm {
  content: string;
  name: string;
}

interface UpdateFileForm {
  fileStructureId?: number;
  structureId?: number;
  content?: string;
  name?: string;
}

interface FindFileForm {
  fileStructureId?: number;
  structureId?: number;
  id?: number;
  name?: string;
}

const tableRules = {
  fileStructureId: {
    type: "number",
  },
  structureId: {
    type: "number",
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
  structureId: number,
  obj: FileForm
) {
  const form = {
    fileStructureId,
    structureId,
    ...obj,
  };

  // @ts-ignore
  await validate.async(form, tableRules, {format: "flat"});

  const hasFileName = await File.findOne({
    where: {
      name: obj.name,
    },
  });

  if (hasFileName) {
    return Promise.reject(error[3001]);
  } else {
    const res = await File.create(form);
    return res.toJSON();
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
  // @ts-ignore
  await validate.async(obj, tableRules, {format: "flat"});

  const hasFile = await File.findByPk(fileId);

  if (hasFile) {
    return await File.update(obj, {
      where: {
        id: fileId,
      },
      limit: 1,
    });
  } else {
    return Promise.reject(error[3002]);
  }
};

export const find = async function (fildForm: FindFileForm, limit?: number) {
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
