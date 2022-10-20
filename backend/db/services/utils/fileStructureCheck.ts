import validate from "validate.js";
import error from "../../error";

interface Structure {
  name: string;
  id: string;
  children?: Structure[];
}

const rules = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false,
    },
  },
  id: {
    type: "string",
    presence: {
      allowEmpty: false,
    },
  },
  children: {
    type: "array",
  },
};

async function recursiveCheck(structure: Structure[], ids = new Map()) {
  for (const item of structure) {
    // 判断层级的id是否重复
    if (ids.has(item.id)) {
      await Promise.reject(error[2004]);
    }
    ids.set(item.id, null);

    // 判断每层结构是否正确
    await validate.async(item, rules);

    // 如果有子集递归校验
    if (item.children instanceof Array) {
      await recursiveCheck(item.children, ids);
    }
  }
}

export default async function check(structure: Structure[]) {
  // 判断是否为数组
  if (!(structure instanceof Array)) {
    await Promise.reject(error[2003]);
  }

  // 递归判断结构
  await recursiveCheck(structure);
}

// check([
//   {
//     name: "123",
//     id: "1",
//     children: [
//       {
//         name: "123",
//         id: "2",
//       },
//     ],
//   },
// ])
//   .then((res) => {
//     console.log(1, res);
//   })
//   .catch((err) => {
//     console.log(2, err);
//   });
