import express from "express";

import * as userServices from "../../db/services/user";
import * as fileStructureServices from "../../db/services/fileStructure";
import nextCatch from "../HOF/nextCatch";
import authMiddleware from "../middleware/auth";
import db from "../../db/modules/db";

const router = express.Router();

router.post(
  "/login",
  nextCatch(async (req, res) => {
    const userInfo = await userServices.login(req.body);
    req.session.token = userInfo;
    res.send(userInfo);
  })
);

router.post(
  "/",
  nextCatch(async (req, res) => {
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
      res.send(userInfo);
    } catch (error) {
      transaction.rollback();
      await Promise.reject(error);
    }
  })
);

router.get(
  "/who-am-i",
  authMiddleware,
  nextCatch(async (req, res) => {
    const userInfo = await userServices.find(req.session.token.id);
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
    const userInfo = await userServices.find(req.params.id);
    res.send(userInfo);
  })
);

export default router;
