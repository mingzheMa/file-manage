import express from "express";
import multer from "multer";
import path from "path";

import * as fileServices from "../../db/services/file";
import * as fileStructureServices from "../../db/services/fileStructure";
import nextCatch from "../HOF/nextCatch";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  nextCatch(async (req, res) => {
    // 获取文件结构id
    const fileStructure = await fileStructureServices.find({
      userId: req.session.token.id,
    });
    const structureId = req.body.structureId;
    delete req.body.fileStructureId;
    delete req.body.structureId;

    res.send(
      await fileServices.create(fileStructure.id, structureId, req.body.files)
    );
  })
);

router.delete(
  "/:id",
  authMiddleware,
  nextCatch(async (req, res) => {
    await fileServices.remove(req.params.id);
    res.send();
  })
);

router.put(
  "/:id",
  authMiddleware,
  nextCatch(async (req, res) => {
    await fileServices.update(req.params.id, req.body);
    res.send();
  })
);

router.get(
  "/",
  authMiddleware,
  nextCatch(async (req, res) => {
    // 获取文件结构id
    const fileStructure = await fileStructureServices.find({
      userId: req.session.token.id,
    });

    // 处理查找数量
    const limit = req.query.limit;
    delete req.query.limit;

    res.send(
      await fileServices.find(
        {
          fileStructureId: fileStructure.id,
          ...req.query,
        },
        limit
      )
    );
  })
);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve(__dirname, "../public/upload"));
  },
  filename(req, file, cb) {
    const fileName = Buffer.from(file.originalname, "latin1").toString("utf-8");
    cb(null, `${Date.now()}-${Math.floor(Math.random() * 100000)}-${fileName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    // fileSize: 0.1, //1M
  },
});

router.post(
  "/upload",
  upload.array("file"),
  authMiddleware,
  nextCatch(async (req, res) => {
    res.send(
      req.files.map((file) => ({
        originalname: Buffer.from(file.originalname, "latin1").toString(
          "utf-8"
        ),
        mimetype: file.mimetype,
        filepath: `/public/upload/${file.filename}`,
      }))
    );
  })
);

export default router;
