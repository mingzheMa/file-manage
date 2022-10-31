import jwt from "jsonwebtoken";
import globalConfig from "../config/global";

const secret = globalConfig.secretKey;

export function val2Token(val, expiresIn: string | number = "1d") {
  return jwt.sign(val, secret, {
    expiresIn,
  });
}

export function token2Val(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}
