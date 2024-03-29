import { createHash } from "crypto";

export default function (string: string) {
  const hash = createHash("sha256");
  hash.update(string);
  return hash.digest("hex");
}
