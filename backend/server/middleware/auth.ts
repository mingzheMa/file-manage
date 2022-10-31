import * as jwtUtils from "../utils/jwt";

export default function (req, res, next) {
  const token = req.headers.authorization || req.cookies.token;
  const info = jwtUtils.token2Val(token);
  if (info) {
    req._jwt = info;
    next();
  } else {
    res.status(401).send("登录过期");
  }
}
