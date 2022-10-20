import "../modules/index";

import * as userServices from "../services/user";

(async function () {
  console.log("----------测试错误添加----------");
  await userServices
    .create({
      mobile: "111",
      password: "123",
    })
    .catch((err) => {
      console.log(err);
    });

  console.log("----------测试正确添加----------");
  await userServices
    .create({
      mobile: "11111111111",
      password: "111111",
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  console.log("----------测试正确删除----------");
  await userServices
    .remove(193)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  console.log("----------测试正确修改----------");
  await userServices
    .update(191, {
      nick_name: "哈哈哈",
      password: "123456",
      mobile: "22222222222",
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  console.log("----------测试正确查找----------");
  await userServices
    .find(191)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  console.log("----------测试正确登录----------");
  await userServices
    .login({
      mobile: "22222222222",
      password: "123456",
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
})();
