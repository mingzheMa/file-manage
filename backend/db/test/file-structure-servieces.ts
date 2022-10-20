import "../modules/index";

import * as fileStructureServices from "../services/fileStructure";

(async function () {
  console.log("----------测试错误添加----------");
  await fileStructureServices
    .create(99999, {
      structure: [],
    })
    .catch((err) => {
      console.log(err);
    });

  console.log("----------测试正确添加----------");
  await fileStructureServices
    .create(194, {
      structure: [],
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  console.log("----------测试正确删除----------");
  await fileStructureServices
    .remove(191)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  console.log("----------测试正确修改----------");
  await fileStructureServices
    .update(8, {
      structure: [{ id: 1, children: [] }],
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  console.log("----------测试正确查找----------");
  await fileStructureServices
    .find(8)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
})();
