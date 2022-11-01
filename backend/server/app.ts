import path from "path";

import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";

import errorMiddleware from "./middleware/error";
import routers from "./routes/index";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 静态文件
app.use(
  "/public",
  express.static(path.join(__dirname, "public"))
);

// 路由
routers.forEach((router) => {
  app.use(router.path, router.router);
});

app.use(errorMiddleware);

export default app;
