import "../modules/index";

import * as fileServices from "../services/file";

(async function () {
  console.log("----------测试错误添加----------");
  await fileServices
    .create(0, 1, {
      content: "1",
      name: "error.jpg",
    })
    .catch((err) => {
      console.log(err);
    });

  console.log("----------测试正确添加----------");
  await fileServices
    .create(8, 1, {
      content: "1",
      name: "a.jpg",
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  console.log("----------测试正确删除----------");
  await fileServices
    .remove(5)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  console.log("----------测试正确修改----------");
  await fileServices
    .update(7, {
      structureId: 2,
      content: "2",
      name: "b.js",
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  console.log("----------测试name正确查找----------");
  await fileServices
    .nameFind(8, "j")
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  console.log("----------测试条件正确查找----------");
  await fileServices
    .find({
      fileStructureId: 8,
      structureId: 1,
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
})();
