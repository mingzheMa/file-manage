import express from "express";
import axios from "axios";

import User from "../../db/modules/User";
import * as userServices from "../../db/services/user";
import * as fileStructureServices from "../../db/services/fileStructure";
import nextCatch from "../HOF/nextCatch";
import authMiddleware from "../middleware/auth";
import db from "../../db/modules/db";
import wxConfig from "../config/wx";
import globalConfig from "../config/global";
import * as jwtUtils from "../utils/jwt";

const router = express.Router();

router.post(
  "/login",
  nextCatch(async (req, res) => {
    const userInfo = await userServices.login(req.body);
    res.send({
      ...userInfo,
      access_token: jwtUtils.val2Token(userInfo, globalConfig.loginTime),
    });
  })
);

router.post(
  "/wx-login",
  nextCatch(async (req, res) => {
    const wxRes = await axios.get(wxConfig.loginLocation, {
      params: {
        appid: wxConfig.appId,
        secret: wxConfig.appSecret,
        js_code: req.body.code,
        grant_type: "authorization_code",
      },
    });

    // 接口报错
    if (wxRes.data.errmsg) {
      await Promise.reject(wxRes.data.errmsg);
    }

    let userInfo = await User.findOne({
      where: { openId: wxRes.data.openid },
    });
    if (userInfo) {
      userInfo = userInfo.toJSON();
      delete userInfo.password
      delete userInfo.openId
      res.send({
        ...userInfo,
        access_token: jwtUtils.val2Token(userInfo, globalConfig.loginTime),
      });
    } else {
      res.send({
        wxLoginToken: jwtUtils.val2Token({
          openId: wxRes.data.openid,
        }),
        message: "用户未绑定微信",
      });
    }
  })
);

// 注册逻辑函数
async function register(req) {
  // 这里需要搞一个事务将用户注册和创建文件结构两个行为捆绑
  const transaction = await db.transaction();

  try {
    const userInfo = await userServices.create(req.body, {
      transaction,
    });
    await fileStructureServices.create(
      userInfo.id,
      {
        structure: [],
      },
      {
        transaction,
      }
    );

    transaction.commit();

    return userInfo;
  } catch (error) {
    transaction.rollback();
    await Promise.reject(error);
  }
}

router.post(
  "/wx-bind-account",
  nextCatch(async (req, res) => {
    const openId = jwtUtils.token2Val(req.body.wxLoginToken).openId;

    // 通过账号密码确定要绑定的用户
    const result = await userServices
      .login({
        mobile: req.body.mobile,
        password: req.body.password,
      })
      .catch((err) => Promise.resolve(err));

    if (result.code && result.code === "400") {
      // 登录失败

      // 确定账户存在
      const hasUser = await User.findOne({
        where: { mobile: req.body.mobile },
      });

      if (hasUser) {
        await Promise.reject("密码错误");
      } else {
        const userInfo = await register(req);

        res.send({
          ...userInfo,
          access_token: jwtUtils.val2Token(userInfo, globalConfig.loginTime),
        });
      }
    } else {
      // 是否绑定了微信
      if (result.isBindWx) {
        await Promise.reject("该用户已经绑定了微信");
      }

      // 用户存在，绑定openid
      await userServices.update(result.id, { openId });

      res.send({
        ...result,
        access_token: jwtUtils.val2Token(result, globalConfig.loginTime),
      });
    }
  })
);

router.post(
  "/",
  nextCatch(async (req, res) => {
    const userInfo = await register(req);
    res.send(userInfo);
  })
);

router.get(
  "/who-am-i",
  authMiddleware,
  nextCatch(async (req, res) => {
    const userInfo = await userServices.find({ id: req._jwt.id });
    res.send(userInfo);
  })
);

router.delete(
  "/:id",
  authMiddleware,
  nextCatch(async (req, res) => {
    await userServices.remove(req.params.id);
    res.send();
  })
);

router.put(
  "/:id",
  authMiddleware,
  nextCatch(async (req, res) => {
    await userServices.update(req.params.id, req.body);
    res.send();
  })
);

router.get(
  "/:id",
  authMiddleware,
  nextCatch(async (req, res) => {
    const userInfo = await userServices.find({ id: req.params.id });
    res.send(userInfo);
  })
);

export default router;
