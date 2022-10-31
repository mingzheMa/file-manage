import { WhereOptions } from "sequelize";
import User from "../modules/User";
import error from "../error";
import sha256 from "../utils/sha256";
import validate from "../validate";

interface UserForm {
  nick_name?: string;
  mobile: string;
  password: string;
  openId?: string;
}

const tableRules = {
  nick_name: {
    type: "string",
    length: {
      minimum: 2,
      maximum: 16,
    },
  },

  mobile: {
    type: "string",
    length: {
      is: 11,
    },
    presence: {
      allowEmpty: false,
    },
  },

  password: {
    type: "string",
    length: {
      minimum: 6,
      maximum: 24,
    },
    presence: {
      allowEmpty: false,
    },
  },
};

export const create = async function (obj: UserForm, payload?: any) {
  // @ts-ignore
  await validate.async(obj, tableRules, { format: "flat" });

  const hasUser = await User.findOne({
    where: {
      mobile: obj.mobile,
    },
  });

  if (hasUser) {
    return Promise.reject(error[1002]);
  } else {
    const userInfo = await User.create(obj, {
      transaction: payload.transaction,
    });
    const json = userInfo.toJSON();
    delete json.password;
    delete json.openId;
    return json;
  }
};

export const remove = async function (userId: number) {
  return await User.destroy({
    where: {
      id: userId,
    },
  });
};

export const update = async function (
  userId: number,
  obj: {
    nick_name?: string;
    mobile?: string;
    password?: string;
    openId?: string;
  }
) {
  const hasUser = await User.findByPk(userId);

  if (hasUser) {
    return await User.update(obj, {
      where: {
        id: userId,
      },
      limit: 1,
    });
  } else {
    return Promise.reject(error[1004]);
  }
};

export const find = async function (where: WhereOptions<User>) {
  const hasUser = await User.findOne({
    where,
  });

  if (hasUser) {
    const json = hasUser.toJSON();
    delete json.password;
    delete json.openId;
    return json;
  } else {
    return Promise.reject(error[1004]);
  }
};

export const login = async function (obj: UserForm) {
  const userInfo = await User.findOne({
    where: {
      mobile: obj.mobile,
      password: sha256(obj.password),
    },
  });

  if (userInfo) {
    const json = userInfo.toJSON();
    delete json.password;
    delete json.openId;
    return json;
  } else {
    return Promise.reject(error[1003]);
  }
};
