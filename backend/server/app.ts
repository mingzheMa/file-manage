import path from "path";

import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectRedis from "connect-redis";

import errorMiddleware from "./middleware/error";
import routers from "./routes/index";
import redisClient from "./redis/index";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// token session
const RedisStore = connectRedis(session);
app.use(
  session({
    store: new RedisStore({ client: redisClient, ttl: 3600 }),
    cookie: { httpOnly: false },
    secret: "session",
    name: "token",
  })
);

// 路由
routers.forEach((router) => {
  app.use(router.path, router.router);
});

app.use(errorMiddleware);

export default app;
