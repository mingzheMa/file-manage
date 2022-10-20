import express from "express";
import multer from "multer";
import path from "path";

import * as fileServices from "../../db/services/file";
import nextCatch from "../HOF/nextCatch";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.post(
  "/",
  nextCatch(async (req, res) => {
    const fileStructureId = req.body.fileStructureId;
    const structureId = req.body.structureId;
    delete req.body.fileStructureId;
    delete req.body.structureId;

    res.send(await fileServices.create(fileStructureId, structureId, req.body));
  })
);

router.delete(
  "/:id",
  nextCatch(async (req, res) => {
    await fileServices.remove(req.params.id);
    res.send();
  })
);

router.put(
  "/:id",
  nextCatch(async (req, res) => {
    await fileServices.update(req.params.id, req.body);
    res.send();
  })
);

router.get(
  "/",
  nextCatch(async (req, res) => {
    const limit = req.query.limit;
    delete req.query.limit;
    console.log(req);

    res.send(await fileServices.find(req.query, limit));
  })
);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve(__dirname, "../public/upload"));
  },
  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${Math.floor(Math.random() * 100000)}-${file.originalname}`
    );
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
        originalname: file.originalname,
        mimetype: file.mimetype,
        filepath: `/public/upload/${file.filename}`,
      }))
    );
  })
);

export default router;
