import OSS from "ali-oss";
import path from "path";

import OSSConfig from "../config/oss";

const client = new OSS({
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: OSSConfig.accessKeyID,
  accessKeySecret: OSSConfig.accessKeySecret,
  bucket: OSSConfig.bucket,
  region: OSSConfig.region,
});

export async function upload(filePath: string) {
  const fileName = path.basename(filePath);
  return await client.put(`/files/${fileName}`, filePath, {
    headers: {
      "x-oss-object-acl": "public-read",
    },
  });
}
