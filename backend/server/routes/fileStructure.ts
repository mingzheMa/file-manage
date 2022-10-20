import express from "express";
import * as fileStructureServices from "../../db/services/fileStructure";
import nextCatch from "../HOF/nextCatch";
import authMiddleware from "../middleware/auth";

const router = express.Router();

// 给用户添加目录结构，仅在用户没有目录结构的时候添加，每个用户仅限一个目录结构
router.post(
  "/",
  nextCatch(async (req, res) => {
    const userId = req.body.userId;
    delete req.body.userId;
    res.send(await fileStructureServices.create(userId, req.body));
  })
);

router.get(
  "/",
  authMiddleware,
  nextCatch(async (req, res) => {
    res.send(
      await fileStructureServices.find({ userId: req.session.token.id })
    );
  })
);

router.put(
  "/",
  authMiddleware,
  nextCatch(async (req, res) => {
    await fileStructureServices.update(
      { userId: req.session.token.id },
      { structure: req.body.structure }
    );
    res.send();
  })
);

export default router;
